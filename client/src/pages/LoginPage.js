import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import CustomInput from '../Components/CustomInput';
import { AuthContext } from '../context/AuthContext'

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [, setMe] = useContext(AuthContext);
    let navigate = useNavigate();

    const loginHandler = async (e) => {
        try {
            e.preventDefault();

            if (username.length < 3 || password.length < 6)
                throw new Error("입력하신 정보가 올바르지 않습니다.");

            const result = await axios.patch("/users/login", { username, password });
            setMe({
                name: result.data.name,
                sessionId: result.data.sessionId,
                userId: result.data.userId
            });

            navigate("/");
            toast.success("로그인에 성공하였습니다.");
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
            <h3>로그인</h3>
            <form onSubmit={loginHandler}>
                <CustomInput label='회원 ID' value={username} setValue={setUsername} />
                <CustomInput
                    label='비밀번호'
                    value={password}
                    setValue={setPassword}
                    type="password"
                />
                <button type='submit'>로그인</button>
            </form>
        </div>
    )
}

export default LoginPage;