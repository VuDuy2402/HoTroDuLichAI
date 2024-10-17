import { useDispatch } from 'react-redux';
import styles from './PromptLogin.module.scss';
import { authAction } from '../../../redux/slices/authSlices';
import { useNavigate } from 'react-router-dom';

const PromptLogin = () => {
    const dispatch = useDispatch();

    const handleClosePrompt = () => {
        dispatch(authAction.deactiveLoginPrompt());
        window.location.href = '/dangnhap';
    }
    return (
        <div className={`prompt-login ${styles.promptLogin}`}>
            <div className={`prompt-login__container p-3 d-flex flex-column justify-content-between bg-white rounded ${styles.promptLoginContainer}`}>
                <div className='prompt-login__container__header border-1 border-bottom mb-2'>
                    <h5>Cảnh Báo</h5>
                </div>
                <div className='prompt-login__container__body'>
                    <p>Có vẻ phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập lại</p>
                </div>
                <div className='prompt-login__container__footer d-flex'>
                    <button className='btn ms-auto btn-success' onClick={handleClosePrompt}>Đóng</button>
                </div>
            </div>
            <div className={`prompt-login__background ${styles.promptLoginBg}`}></div>
        </div>
    )
}

export default PromptLogin;