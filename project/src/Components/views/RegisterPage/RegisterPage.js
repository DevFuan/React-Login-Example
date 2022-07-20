import React from 'react'
import { useNavigate } from 'react-router-dom'
import {useDispatch} from 'react-redux';
import {registerUser} from '../../../_action/user_action'
import Auth from '../../../hoc/auth'

function RegisterPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [Email, setEmail] = React.useState("")
    const [Password, setPassword] = React.useState("")
    const [Name, setName] = React.useState("")
    const [ConfirmPassword, setComfirmPassword] = React.useState("")

    const onEmailHandler = (event) => {
      setEmail(event.currentTarget.value)
    }
    
    const onPasswordHandler = (event) => {
      setPassword(event.currentTarget.value)
    }

    const onNameHandler = (event) => {
      setName(event.currentTarget.value)
    }

    const onConfirmPasswordHandler = (event) => {
      setComfirmPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault(); //리프레시 방지-> 방지해야 이 아래 라인의 코드들 실행 가능 

        // console.log('Email', Email);
        // console.log('Password', Password);

        if(Password !== ConfirmPassword) {
          return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
        }


        let body={
            email: Email,
            password: Password,
            name: Name
        }

        //디스패치로 액션 취하기
        dispatch(registerUser(body))
        .then(response => {
            if(response.payload.success) {
                navigate("/login")
            } else{
                alert('중복된 이메일이 있습니다')
            }
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

          <label>Name</label>
          <input type="text" value={Name} onChange={onNameHandler}/>

          <label>Password</label>
          <input type="password" value={Password} onChange={onPasswordHandler}/>

          <label>Confirm Password</label>
          <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler}/>


          <br />
          <button type = "submit">회원가입</button>
      </form>
    </div>
  )
}

export default Auth(RegisterPage,false)
