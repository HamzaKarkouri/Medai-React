import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [state, setState] = useState('Sign Up'); // 'Sign Up' or 'Login'
  const [activeTab, setActiveTab] = useState('Patient'); // 'Patient' or 'Doctor'
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [speciality, setSpeciality] = useState('General physician');
  const [degree, setDegree] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');

  const navigate = useNavigate();
  const { backendUrl, token, setToken ,setDToken} = useContext(AppContext);


  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (activeTab === "Patient") {
        const endpoint = state === "Sign Up" ? "/api/user/register" : "/api/user/login";
        const { data } = await axios.post(backendUrl + endpoint, { name, email, password });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success(`${state} successful`);
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else if (activeTab === "Doctor") {
        if (state === "Sign Up") {
          if (!docImg) return toast.error("Please upload a doctor image.");

          const formData = new FormData();
          formData.append("name", name);
          formData.append("email", email);
          formData.append("password", password);
          formData.append("image", docImg);

          const { data } = await axios.post(backendUrl + "/api/admin/add-doctor", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (data.success) {
            toast.success("Doctor registered successfully!");
          } else {
            toast.error(data.message);
          }
        } else {
          const { data } = await axios.post(backendUrl + "/api/doctor/login", { email, password });

          if (data.success) {
            localStorage.setItem("dToken", data.token);
            setDToken(data.token);
            toast.success("Doctor login successful");
            navigate("/doctordashboard");
          } else {
            toast.error(data.message);
          }
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
  };

  const resetDoctorForm = () => {
    setDocImg(false);
    setName('');
    setEmail('');
    setPassword('');
    setExperience('1 Year');
    setFees('');
    setAbout('');
    setSpeciality('General physician');
    setDegree('');
    setAddress1('');
    setAddress2('');
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);
 

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">

        {/* Tab Bar */}
        <div className="flex w-full justify-between mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('Patient')}
            className={`w-1/2 py-2 text-center ${activeTab === 'Patient' ? 'bg-primary text-white' : 'bg-gray-100 text-black'}`}
          >
            Patient
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Doctor')}
            className={`w-1/2 py-2 text-center ${activeTab === 'Doctor' ? 'bg-primary text-white' : 'bg-gray-100 text-black'}`}
          >
            Doctor
          </button>
        </div>

        {/* Form Title */}
        <p className="text-2xl font-semibold">{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} as a {activeTab.toLowerCase()}.</p>

        {/* Form Content */}
        {activeTab === 'Patient' && (
          <>
            {state === 'Sign Up' && (
              <div className="w-full">
                <p>Full Name</p>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="border border-[#DADADA] rounded w-full p-2 mt-1"
                  type="text"
                  required
                />
              </div>
            )}
            <div className="w-full">
              <p>Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="email"
                required
              />
            </div>
            <div className="w-full">
              <p>Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="password"
                required
              />
            </div>
          </>
        )}

        {activeTab === 'Doctor' && (
          <>
            {state === 'Sign Up' && (
              <>
                
                <div className="w-full">
                  <p>Full Name</p>
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="border border-[#DADADA] rounded w-full p-2 mt-1"
                    type="text"
                    required
                  />
                </div>
                <div className="w-full">
              <p>Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="email"
                required
              />
            </div>
            <div className="w-full">
              <p>Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="password"
                required
              />
            </div>
            <div className='w-full'>
                            <p>Experience</p>
                            <select onChange={e => setExperience(e.target.value)} value={experience} className='border border-[#DADADA] rounded w-full p-2 mt-1' >
                                <option value="1 Year">1 Year</option>
                                <option value="2 Year">2 Years</option>
                                <option value="3 Year">3 Years</option>
                                <option value="4 Year">4 Years</option>
                                <option value="5 Year">5 Years</option>
                                <option value="6 Year">6 Years</option>
                                <option value="8 Year">8 Years</option>
                                <option value="9 Year">9 Years</option>
                                <option value="10 Year">10 Years</option>
                            </select>
                        </div>
                        <div className='w-full'>
                            <p>Fees</p>
                            <input onChange={e => setFees(e.target.value)} value={fees} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="number" placeholder='Doctor fees' required />
                        </div>
                        <div className='w-full'>
                            <p>Speciality</p>
                            <select onChange={e => setSpeciality(e.target.value)} value={speciality} className='border border-[#DADADA] rounded w-full p-2 mt-1'>
                                <option value="General physician">General physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatricians">Pediatricians</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                            </select>
                        </div>
                        <div className='w-full'>
                            <p>Degree</p>
                            <input onChange={e => setDegree(e.target.value)} value={degree} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" placeholder='Degree' required />
                        </div>

                        <div className='fw-full'>
                            <p>Address</p>
                            <input onChange={e => setAddress1(e.target.value)} value={address1} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" placeholder='Address 1' required />
                            <input onChange={e => setAddress2(e.target.value)} value={address2} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" placeholder='Address 2' required />
                        </div>
                        <div className='fw-full'>
                    <p>About Doctor</p>
                    <textarea onChange={e => setAbout(e.target.value)} value={about} className='border border-[#DADADA] rounded w-full p-2 mt-1'  placeholder='write about doctor'></textarea>
                </div>
            <div className="w-full">
                  <p>Upload Picture</p>
                  <input
                    onChange={(e) => setDocImg(e.target.files[0])}
                    type="file"
                    required
                  />
                </div>
              
              </>
            )}
              <div className="w-full">
              <p>Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="email"
                required
              />
            </div>
            <div className="w-full">
              <p>Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border border-[#DADADA] rounded w-full p-2 mt-1"
                type="password"
                required
              />
            </div>
          </>
        )}

        {/* Submit Button */}
        <button className="bg-primary text-white w-full py-2 my-2 rounded-md text-base">
          {state === 'Sign Up' ? 'Create account' : 'Login'}
        </button>
        {state === 'Sign Up' ? (
          <p>
            Already have an account?{' '}
            <span onClick={() => setState('Login')} className="text-primary underline cursor-pointer">
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{' '}
            <span onClick={() => setState('Sign Up')} className="text-primary underline cursor-pointer">
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
