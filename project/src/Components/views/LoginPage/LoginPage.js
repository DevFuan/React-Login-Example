import React from 'react'
import { useNavigate } from 'react-router-dom'
import {useDispatch} from 'react-redux';
import {loginUser , oAuthLine} from '../../../_action/user_action'
import Auth from '../../../hoc/auth'

function LoginPage(props) {     //파라미터로 props 넣어줘야함! 로그인 완료된 후 처음 화면으로 돌아가게 하기 위함 

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [Email, setEmail] = React.useState("")
    const [Password, setPassword] = React.useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }
    
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault(); //리프레시 방지-> 방지해야 이 아래 라인의 코드들 실행 가능 

        // console.log('Email', Email);
        // console.log('Password', Password);


        let body={
            email: Email,
            password: Password
        }

        //디스패치로 액션 취하기
        dispatch(loginUser(body))
        .then(response => {
            if(response.payload.loginSuccess) {
                navigate("/")             //리액트에서 페이지 이동하기 위해서는 props.history.push() 이용.
               										// 로그인 완료된 후 처음 화면(루트 페이지-landingpage로)으로 돌악가게 하기 
            } else{
                alert(' Error')
            }
        })
    }

    const onLineHandler = (event) => {
        event.preventDefault(); //리프레시 방지-> 방지해야 이 아래 라인의 코드들 실행 가능 

        console.log('Email', Email);

        //디스패치로 액션 취하기
        dispatch(oAuthLine())
        .then(response => {
            // if(response.payload.loginSuccess) {
            //     navigate("/")             //리액트에서 페이지 이동하기 위해서는 props.history.push() 이용.
            //    										// 로그인 완료된 후 처음 화면(루트 페이지-landingpage로)으로 돌악가게 하기 
            // } else{
            //     alert(' Error')
            // }
            console.log(response)
        })
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            
            
            <form style={{display: 'flex', flexDirection: 'column'}}
                onSubmit={onSubmitHandler}
            >

                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler}/>   
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler}/>
                <br />
                <button type = "submit">Login</button>
                <button type = "Line" onClick={onLineHandler}>Line Login</button>
            </form>
        </div>
    )
}

export default Auth(LoginPage,false)