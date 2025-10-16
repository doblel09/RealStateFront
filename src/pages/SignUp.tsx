import Form from "@/components/Signup/Form"
import {useState} from "react"

const SignUp = () => {
  const [userType, setUserType] = useState("")

  return (
    <div className="flex gap-4 flex-col">
      <h1 className="text-2xl font-bold text-center">Sign up</h1>
      {userType.length > 0 ? (
        <Form userType={userType} />
      ) : (
        <div className="flex flex-col items-center gap-4 w-full max-w-2xl">
          <p className="text-lg font-medium">Select User Type:</p>
          <button className="bg-[#619154] text-white px-4 py-2 rounded-lg hover:bg-[#5a8b4c]" onClick={() => setUserType('agent')}>I want to sell/rent</button>
          <button className="bg-[#619154] text-white px-4 py-2 rounded-lg hover:bg-[#5a8b4c]" onClick={() => setUserType('client')}>I want to buy/rent</button>
        </div>
      )}
    </div>
  )
}

export default SignUp
