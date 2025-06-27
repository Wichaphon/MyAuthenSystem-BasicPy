import React, { useCallback, useState, useEffect } from "react";
import './RegisterForm.css';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

export default function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    myname: '',
    picture: null,
    address: '',
    lat: '',
    lng: '',
  });

  const [center, setCenter] = useState({
    lat: 13.736717,
    lng: 100.523186,
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: '',
    libraries: ['places'],
  });

  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          setCenter({ lat, lng });
          setMarker({ lat, lng });
          setFormData(prev => ({ ...prev, lat, lng }));

          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (result, status) => {
            if (status === 'OK' && result[0]) {
              setFormData(prev => ({ ...prev, address: result[0].formatted_address }));
            }
          });
        },
        (err) => {
          console.warn("GPS denied or unavailable:", err.message);
        }
      );
    }
  }, []);

  const handleMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarker({ lat, lng });
    setFormData(prev => ({ ...prev, lat, lng }));

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (result, status) => {
      if (status === 'OK' && result[0]) {
        setFormData(prev => ({ ...prev, address: result[0].formatted_address }));
      }
    });
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'picture') {
      const file = e.target.files?.[0];
      if (!file) return;

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 10 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        alert('Only JPG and PNG images are allowed.');
        return;
      }

      if (file.size > maxSize) {
        alert('Image must be less than 10 MB.');
        return;
      }

      setFormData({ ...formData, picture: file });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      myname: '',
      picture: null,
      address: '',
      lat: '',
      lng: '',
    });
    setMarker(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.address.trim()) {
      alert("Please select your address on the map.");
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await fetch('http://localhost/auth/register', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        resetForm(); 
        setTimeout(() => {
          navigate('/');
        }, 150);
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      console.error(err);
      alert('Cannot connect to server.');
    }
  };

  return isLoaded ? (
    <div className="Register-Box">
      <form className="input-content" onSubmit={handleSubmit} encType="multipart/form-data">
        <h1 className="Header-Register">Register</h1>

        <div className="input-form">
          <input type="text" name="username" placeholder="Username" onChange={handleChange} required value={formData.username} />
        </div>

        <div className="input-form">
          <input type="text" name="myname" placeholder="Full name" onChange={handleChange} required value={formData.myname} />
        </div>

        <div className="input-form">
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required value={formData.password} />

        </div>
        <div className="file-input">
          <input type="file" name="picture" accept="image/png, image/jpg, image/jpeg" onChange={handleChange} required />
        </div>

        <div>
          <p>Click on map to choose your address:</p>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            onClick={handleMapClick}
          >
            {marker && <Marker position={marker} />}
          </GoogleMap>
          <div className="address-output">
            <input name="address" value={formData.address} onChange={handleChange} readOnly required />
          </div>
        </div>

        <div>
          <button type="submit">Register</button>
        </div>

        <div className="Login-link">
          <p>Already have an account? <Link to="/">Login</Link></p>
        </div>
      </form>
    </div>
  ) : <div>Loading map...</div>;
}