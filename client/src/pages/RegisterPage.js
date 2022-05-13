import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import CustomInput from '../Components/CustomInput';
import { AuthContext } from '../context/AuthContext';


const RegisterPage = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [, setMe] = useContext(AuthContext);
    let navigate = useNavigate();

    const submitHandler = async (e) => {
        try {
            e.preventDefault();

            if (username.length < 3)
                throw new Error("회원ID는 3자 이상으로 해주세요.");
            if (password.length < 6)
                throw new Error("비밀번호는 6자 이상으로 해주세요.");
            if (password !== passwordCheck)
                throw new Error("비밀번호가 일치하지 않습니다.");

            const result = await axios.post("/users/register", { name, username, password });

            setMe({
                userId: result.data.userId,
                sessionId: result.data.sessionId,
                name: result.data.name
            });

            navigate("/");
            toast.success("회원가입에 성공하였습니다.")
        } catch (err) {
            toast.error(err.message);
        }
    }

    return (
        <div
            style={{
                marginTop: 100,
                maxWidth: 350,
                margin: "auto"
            }}
        >
            <h3>회원가입</h3>
            <form onSubmit={submitHandler}>
                <CustomInput label='이름' value={name} setValue={setName} />
                <CustomInput label='회원 ID' value={username} setValue={setUsername} />
                <CustomInput
                    label='비밀번호'
                    value={password}
                    setValue={setPassword}
                    type="password"
                />
                <CustomInput
                    label='비밀번호 확인'
                    value={passwordCheck}
                    setValue={setPasswordCheck}
                    type="password"
                />
                <button type='submit'>회원가입</button>
            </form>
        </div>
    )
}

export default RegisterPage;