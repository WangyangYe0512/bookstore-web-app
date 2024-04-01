function validation(values){
    let error={
        userName:'',
        email:'',
        password:'',
        confirmPassword:''
    }
    const name_pattern = /^(?=.{1,50}$)[A-Za-zÀ-ÖØ-öø-ÿ\s'\-.]+$/;
    const email_pattern = /^(?=.{1,255}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,20}$/; //Be at least 8 characters long and not more than 20 characters. Contain at least one digit. Contain at least one lowercase letter. Contain at least one uppercase letter.

    if(values.userName===""){
        error.userName="User name should not be empty"
    }
    else if(!name_pattern.test(values.userName)){
        error.userName="User name should only contains english character"
    }
    else{
        error.userName=""
    }

    if(values.email===""){
        error.email="Email should not be empty"
    }
    else if(!email_pattern.test(values.email)){
        error.email="Email format not correct"
    }else{
        error.email=""
    }

    if(values.password===""){
        error.password="Password should not be empty"
    }
    else if(!password_pattern.test(values.password)){
        error.password="Password should be 8-20 characters and include at least one lowercase letter, one uppercase letter, and one digit"
    }else{
        error.password=""
    }

    if(values.confirmPassword!==values.password){
        error.confirmPassword="Confirm Password does not match with Password, please try again"
    }

    //console.log(error);
    return error;
}

export default validation;