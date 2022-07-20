import React, { useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom"
import Auth from '../../../hoc/auth'

function LandingPage() {//Functional Component 만들기

    const navigate = useNavigate()
    
    const onClickHandler = () => {
        axios.get('/api/users/logout')
            .then(response => {
                if (response.data.success) {
                    navigate("/login")
                }
                else {
                    console.log("로그아웃 실패 하였습니다")
                }
            })
    }

    const auth = useSelector((state) => state.user);

    console.log(auth.showLogoutBtn)

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>

            <h2> 시작 페이지 </h2>

            {
                auth.showLogoutBtn  && <button onClick={onClickHandler}>
                Logout
                </button>
            }
        </div>
    )
}

export default Auth(LandingPage, null)