import React,{useCallback, useState} from "react";
import './RegisterForm.css'
import {Link} from 'react-router-dom'
import { GoogleMap, useJsApiLoader, Marker} from '@react-google-maps/api'

const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: 13.736717, // Bankok
    lng: 100.523186
}

export default function RegisterForm(){

    const [formData , setFormData] = useState({
        username: '',
        password: '',
        myname:'',
        picture: null,
        address:'',
        lat:'',
        lng:'', 
    });

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyDrIITkhW7h2Mc5kLsB1eGBFnBeixak9A8',
        libraries: ['places']
    });

    const [marker , setMarker] = useState(null);

    const handleMapClick = useCallback((e) =>{
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarker({ lat, lng});
        setFormData(prev => ({...prev, lat, lng}));

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng} }, (result, status) => {
            if (status === 'OK' && result[0]){
                setFormData(prev => ({...prev, address: result[0].formatted_address }));
            }
        });
    }, []);

    // const [error, setError] = useState('');
    // const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        if (e.target.name === 'picture') {
            const file = e.target.file?.[0];
            if (!file) return;

            const validTypes = ['image/jpeg','image/jpg','image/png'];
            const maxSize = 10 * 1024 * 1024; // 10 mb เท่านั้น

            if (!validTypes.includes(file.type)) {
                alert('File invalid');
                return;
            }

            if (file.size > maxSize){
                alert('File need to be only 10 MB');
                return;
            }

            setFormData({ ...formData, picture: file });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async(e) =>{
        e.preventDefault();

        if (!formData || formData.address.trim() === ""){
            alert("Please add your address ")
            return;
        }
        const data = new FormData();
        for (const key in formData){
            data.append(key, formData[key]);
        }

        try{
            const response = await fetch('http://localhost/auth/register',{
                method: 'Post',
                body: data,
            });

            const result = await response.json();
            if (response.ok){
                alert('register success');
            } else {
                alert('error'+ result.error);
            }
        } catch (err){
            console.error(err);
            alert('Cant connect to server');
        }
    }


    return isLoaded ?(
        <div className="Box">
            <form className="input-content" action="" onSubmit={handleSubmit} encType="multipart/form-data">
                <h1 className="Header">Register</h1>
                <div className="input-form">
                    <input type="text" name="username" placeholder="Username" onChange={handleChange} required/>
                </div>
                <div className="input-form">
                    <input type="text" name="myname" placeholder="Full name" onChange={handleChange} required/>
                </div>
                <div className="input-form">
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required/>
                </div>
                <div>
                    <input type="file" name="picture" accept="imagae/png, image/jpg, image/jpeg" onChange={handleChange} required/>
                </div>
                <div>
                    <p>Click on map to choose your address:</p>
                    <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={12}
                    onClick={handleMapClick}>
                        {marker && <Marker position={marker}/>}
                    </GoogleMap>
                    <input name="address" value={formData.address} onChange={handleChange} readOnly required/>
                </div>
                <div>
                    <button type="submit">Register</button>
                </div>
                <div className="Login-link">
                    <p>Already have an account <Link to="/"> Login</Link></p>
                </div>
            </form>
        </div>
    ) : <div>Loading ...</div> ;
}