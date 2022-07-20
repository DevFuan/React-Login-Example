import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { auth } from '../_action/user_action'

export default function Auth(SpecificComponent, option, adminRoute = null) { 
    
    //option 
    // null - any
    // true - loginUser
    // false - user
    

    function AuthenticationCheck(props){
        const dispatch = useDispatch()
        const nevigate = useNavigate()

        useEffect(() => {

            dispatch(auth()).then(response => {
                console.log('option : '+ option+' adminRoute : '+ adminRoute+' isAuth : ' + response.payload.isAuth)
                
                if(!response.payload.isAuth) {
                    if (option) {
                        nevigate("/login")
                    }
                }else{
                    if(adminRoute && !response.payload.isAuth) {
                        nevigate("/")
                    }
                    else{
                        if(!option) 
                            nevigate("/")
                    }
                }
            })
        }, [dispatch,nevigate])

        return(
        <SpecificComponent />
        )
    }


    return AuthenticationCheck
}