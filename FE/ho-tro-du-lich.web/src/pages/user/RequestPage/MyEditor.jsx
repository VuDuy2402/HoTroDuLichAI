import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import { localStorageService } from '../../../services/localstorageService';
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";

const MyEditor = () => {
    const [errors, setErrors] = useState([]);
    const quillRef = useRef(null);

    const handleImageUpload = async (files) => {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("Files", files[i]);
        }

        try {
            const accessToken = localStorageService.getAccessToken();
            const response = await axios.post(
                'https://localhost:7001/api/v1/admin/fileupload/imagekit/bulkupload',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );
            if (response && response.data) {
                if (response.data.success) {
                    const imageUrls = response.data.data.imageInfos.map(img => img.fileUrl);
                    return imageUrls;
                } else if (response.errors) {
                    setErrors(response.errors);
                }
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setErrors(['Error uploading image']);
        }

        return null;
    };

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.setAttribute('multiple', 'true');
        input.click();

        input.onchange = async (e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                const imageUrls = await handleImageUpload(files);

                if (imageUrls) {
                    const editor = quillRef.current.getEditor();
                    const range = editor.getSelection();

                    if (range) {
                        imageUrls.forEach(imageUrl => {
                            editor.insertEmbed(range.index, 'image', imageUrl);
                        });

                        const newRange = range.index + imageUrls.length;
                        editor.setSelection(newRange);
                    } else {
                        const length = editor.getLength();
                        imageUrls.forEach(imageUrl => {
                            editor.insertEmbed(length, 'image', imageUrl);
                        });
                    }
                }
            }
        };
    };

    const modules = {
        toolbar: {
            container: [
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote'],
                [{ 'align': [] }],
                ['link', 'image'],
            ],
            handlers: {
                image: imageHandler,
            },
        },
    };

    return (
        <>
            <FormErrorAlert errors={errors} />
            <ReactQuill
                ref={quillRef}
                theme="snow"
                modules={modules}
            />
        </>
    );
};

export default MyEditor;
