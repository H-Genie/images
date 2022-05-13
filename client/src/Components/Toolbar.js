import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext';

const Toolbar = () => {
    const [me, setMe] = useContext(AuthContext);

    const logoutHandler = async () => {
        try {
            await axios.patch("/users/logout")

            setMe();
            toast.success("로그아웃 되었습니다.");
        } catch (err) {
            toast.error(err.message);
        }
    }

    return (
        <div>
            <Link to="/">
                <span>홈</span>
            </Link>

            {
                me ? (
                    <span onClick={logoutHandler} style={{ float: 'right' }}>로그아웃 ({me.name})</span>
                ) : (
                    <>
                        <Link to="/auth/login">
                            <span style={{ float: 'right' }}>로그인</span>
                        </Link>
                        <Link to="/auth/register">
                            <span style={{ float: 'right', marginRight: 15 }}>회원가입</span>
                        </Link>
                    </>
                )
            }
        </div>
    )
}

export default Toolbar;