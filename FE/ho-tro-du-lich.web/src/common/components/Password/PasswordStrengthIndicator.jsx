import { useEffect, useState } from "react";

const PasswordStrengthIndicator = ({ password }) => {
    const [passwordStrength, setPasswordStrength] = useState({ level: "", percent: 0 });

    useEffect(() => {
        const getPasswordStrength = (password) => {
            if (!password) return { level: "", percent: 0 };

            const lengthCriteria = password.length >= 8;
            const hasNumber = /\d/.test(password);
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

            let strength = "Yếu";
            let strengthPercent = 0;

            if (lengthCriteria && (hasUpperCase || hasLowerCase) && (hasNumber || hasSpecialChar)) {
                strength = "Bình Thường";
                strengthPercent = 40;
            }
            if (lengthCriteria && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
                strength = "Mạnh";
                strengthPercent = 70;
            }
            if (lengthCriteria && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && password.length >= 12) {
                strength = "Rất Mạnh";
                strengthPercent = 100;
            }

            setPasswordStrength({ level: strength, percent: strengthPercent });
        };

        getPasswordStrength(password);
    }, [password]);

    const getLevelClass = (level) => {
        switch (level) {
            case "Yếu":
                return "danger";
            case "Bình Thường":
                return "warning";
            case "Mạnh":
                return "success";
            case "Rất Mạnh":
                return "primary";
            default:
                return "secondary";
        }
    };

    const levels = ["Yếu", "Bình Thường", "Mạnh", "Rất Mạnh"];

    const activeLevels = levels.slice(0, levels.indexOf(passwordStrength.level) + 1);

    return (
        <>
            {password && (
                <>
                    <div className="d-flex justify-content-between mt-2">
                        {levels.map((level, index) => (
                            <div
                                key={level}
                                className={`bg-${getLevelClass(level)} flex-grow-1 rounded`}
                                style={{
                                    height: '2px',
                                    visibility: index < activeLevels.length ? 'visible' : 'hidden',
                                }}
                            ></div>
                        ))}
                    </div>

                    <div className="d-flex justify-content-between text-center mt-1" style={{ fontSize: "0.5rem" }}>
                        {levels.map((level) => (
                            <span
                                key={level}
                                className={activeLevels.includes(level) ? `text-${getLevelClass(level)}` : 'text-muted'}
                                style={{ visibility: level === passwordStrength.level ? 'visible' : 'hidden' }}
                            >
                                {level}
                            </span>
                        ))}
                    </div>
                </>
            )}
        </>
    );
};

export default PasswordStrengthIndicator;