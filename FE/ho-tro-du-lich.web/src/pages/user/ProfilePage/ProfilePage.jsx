import defaultAvt from "@/assets/img/profileavt.jpg";
import { IKUpload } from "imagekitio-react";
import { CBlobType, CImageType } from "@/enum/fileEnum";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { systemAction } from "@/redux/slices/systemSlice";
import styles from "./ProfilePage.module.scss";
import { useForm } from "react-hook-form";
import Input from "../../../common/components/Input/Input";
import { MdOutlineEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { patternUtils } from "../../../utils/pattern";
import ErrorField from "../../../common/components/ErrorField/ErrorField";
import { userService } from "../../../services/userSerivce";
import FormErrorAlert from "../../../common/components/FormErrorAlert/FormErrorAlert";
import useDocumentTitle from "../../../common/js/useDocumentTitle";
const ProfilePage = () => {
    const { handleSubmit, register, reset } = useForm();
    const [infoUser, setInfoUser] = useState({});
    const [myProfile, setMyProfile] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState([]);
    const ikUploadRef = useRef(null);
    const dispatch = useDispatch();
    useDocumentTitle('Thông tin cá nhân');
    const onError = (err) => {
        toast.error(err.message);
    };

    const onSuccess = async (res) => {
        const data = {
            fileId: res.fileId,
            imageType: CImageType.Avatar,
            uploadProvider: CBlobType.ImageKit,
        };
        const updateProfile = await userService.updateAvatar(data);
        if (updateProfile.success) {
            toast.success("Tải ảnh thành công.");
            const getUserInfo = await userService.getBaseProfile();
            if (getUserInfo.success) {
                setInfoUser(getUserInfo.data);
            }
        } else {
            toast.error("Đã có lỗi xảy ra.");
        }
        dispatch(systemAction.disableLoading());
    };
    const fetchApi = async () => {
        dispatch(systemAction.enableLoading());
        const dataUser = await userService.getBaseProfile();
        if (dataUser?.success) {
            setInfoUser(dataUser.data);
        }
        dispatch(systemAction.disableLoading());
    };
    const fetchApiMyProfile = async () => {
        dispatch(systemAction.enableLoading());
        const myProfileData = await userService.getMyProfile();
        if (myProfileData?.success) {
            setMyProfile(myProfileData.data);
            handleSetInitValue(myProfileData.data);
        }
        dispatch(systemAction.disableLoading());
    };
    const handleSetInitValue = (data) => {
        reset({
            fullName: data?.fullName,
            email: data?.email,
            dateOfBirth: data?.dateOfBirth,
            phoneNumber: data?.phoneNumber,
            address: data?.address,
        });
    };
    useEffect(() => {
        fetchApi();
        fetchApiMyProfile();
    }, []);

    const submitEditProfile = async (data) => {
        data.userId = myProfile.userId;
        const result = await userService.updateMyProfile(data);
        if (result) {
            if (result.success) {
                fetchApiMyProfile();
                toast.success("Cập nhật thông tin thành công.");
            } else if (result.errors) {
                setErrors(result.errors);
            }
        }
        setIsEdit(false);
    };
    return (
        <div
            className="profile-page border bg-white mt-2 rounded shadow"
            style={{ overflowY: "auto", maxHeight: "calc(100vh - 60px)" }}
        >
            <FormErrorAlert errors={errors} />
            <div className="profile-page__title p-2">
                <h4>Thông Tin Cá Nhân</h4>
            </div>
            <div className="profile-page__body p-2">
                <div className="frame-avatar w-100 d-flex flex-column justify-content-center align-items-center border-1 border-bottom">
                    <div
                        className="frame-label rounded-pill border overflow-hidden"
                        style={{ width: "100px", height: "100px", position: "relative" }}
                    >
                        <img
                            className="w-100"
                            src={infoUser?.picture || defaultAvt}
                            style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                objectPosition: "50% 50%",
                            }}
                        ></img>

                        <div className={`btn p-0 btn-light ${styles.btnUpdateImage}`}>
                            <IKUpload
                                className="w-100 h-100"
                                ref={ikUploadRef}
                                style={{ opacity: 0 }}
                                onError={onError}
                                onSuccess={onSuccess}
                                onUploadProgress={() => dispatch(systemAction.enableLoading())}
                            />
                            {ikUploadRef && (
                                <button
                                    className={`${styles.btnUpdateImage}`}
                                    onClick={() => ikUploadRef.current.click()}
                                >
                                    Đổi ảnh
                                </button>
                            )}
                        </div>
                    </div>
                    <h4>{infoUser?.fullName || "Default"}</h4>
                </div>
                <div className="frame-detail-info bg-white">
                    {/* email */}
                    <form
                        onSubmit={handleSubmit(submitEditProfile)}
                        className="d-flex flex-column gap-3 p-2"
                    >
                        <div className="d-flex justify-content-end">
                            {isEdit && (
                                <>
                                    <button
                                        type="submit"
                                        className="btn btn-light d-flex align-items-center"
                                    >
                                        <FaCheck size={"20px"} />
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={() => {
                                            setIsEdit(false);
                                            handleSetInitValue(myProfile);
                                        }}
                                    >
                                        Bỏ
                                    </button>
                                </>
                            )}
                            {!isEdit && (
                                <button
                                    type="button"
                                    className="btn btn-light d-flex align-items-center"
                                    onClick={() => setIsEdit(true)}
                                >
                                    <MdOutlineEdit size={"20px"} />
                                </button>
                            )}
                        </div>
                        <Input
                            disabled={!isEdit}
                            label={"Họ và Tên"}
                            register={register}
                            name={"fullName"}
                        />
                        <ErrorField field={"FullName_Error"} errorList={errors} />
                        <Input
                            disabled
                            label={"Email"}
                            register={register}
                            name={"email"}
                        />
                        <ErrorField field={"Email_Error"} errorList={errors} />
                        <Input
                            label={"Ngày sinh"}
                            type="date"
                            defaultValue={myProfile?.dateOfBirth || ""}
                            disabled={!isEdit}
                            register={register}
                            name={"dateOfBirth"}
                        />
                        <ErrorField field={"DateOfBirth_Error"} errorList={errors} />
                        <Input
                            label={"Số điện thoại"}
                            disabled={!isEdit}
                            register={register}
                            name={"phoneNumber"}
                            pattern={patternUtils.phoneVN}
                        />
                        <ErrorField field={"PhoneNumber_Error"} errorList={errors} />
                        <Input
                            label={"Địa chỉ"}
                            disabled={!isEdit}
                            name={"address"}
                            register={register}
                        />
                        <ErrorField field={"Address_Error"} errorList={errors} />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
