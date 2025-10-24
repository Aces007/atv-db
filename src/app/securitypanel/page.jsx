"use client";
import { useState } from "react";
import { useWebsiteContext } from "../WebsiteContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";



const Security = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { handlePasswordUpdate } = useWebsiteContext();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const getPasswordStrength = (password) => {
        let score = 0
        if (password.length >= 8) {
            score += 1;
        }
        if (/[A-Z]/.test(password)) {
            score += 1;
        }
        if (/[0-9]/.test(password)) {
            score += 1;
        }
        if (/[^A-Za-z0-9]/.test(password)) {
            score += 1;
        }   
        return score;
    };

    const passStrength = getPasswordStrength(password);
    const strengthText = ["Very Weak", "Weak", "Strong", "Very Strong"];
    const colors = ["#800000", "#800000d0", "#FFE200", "#ffe100d5"];

    const togglePassword = () => {
        setPasswordVisible(!passwordVisible);
    }
    const toggleConfirmPassword = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    }

    return (
        <div className="info_cont">
            <div className="info_content">
                <div className="edit_security">
                    <h2 className="securityInfo_label">Security</h2>

                    <div className="change_pass">
                        <h3 className="changePass_label">Change Password</h3>

                        <div className="password_inputs">
                            <div className="password flex flex-col items-start mt-4">
                                <input type={passwordVisible ? "text" : "password"}  placeholder="Password" className="personalInfo_inputs" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                <button type="button" className="eyeBtnPassword" onClick={togglePassword}>
                                    <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} color="rgba(0,0,0,0.7)"/>
                                </button>
                                <label className="personalInfo_labels">Password</label>
                            </div>
                            
                            
                            <div className="confirm_password flex flex-col items-start mt-4">
                                <input type={confirmPasswordVisible ? "text" : "password"} placeholder="Confirm Password" className="personalInfo_inputs" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                                <button type="button" className="eyeBtnConfirmPassword" onClick={toggleConfirmPassword}>
                                    <FontAwesomeIcon icon={confirmPasswordVisible ? faEyeSlash : faEye} color="rgba(0,0,0,0.7)"/>
                                </button>
                                <label className="personalInfo_labels">Confirm Password</label>
                            </div>

                            <div className="flex flex-col gap-4 mt-8 w-3/4">
                                <div className="flex flex-row items-center gap-8">
                                    <p className="font-Montserrat font-bold text-white">Password Strength</p>
                                    <div className="h-2 w-2/4 bg-gray-300 rounded">
                                        <div className="h-2 rounded transition-all" style={{
                                            width: `${(passStrength / 4) * 100}%`,
                                            backgroundColor: colors[passStrength - 1] || "transparent",
                                            }}
                                        />
                                        </div>
                                </div>
                                <p className="font-Montserrat font-medium" style={{ color: colors[passStrength - 1] || '#fff' }}>{password ? strengthText[passStrength - 1] || "Too Short" : "—"}</p>

                                <button className="updatePassword_btn w-2/4" onClick={() => handlePasswordUpdate(password, confirmPassword)}>Update Password</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Security;