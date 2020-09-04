import React, { useState } from 'react';
import Axios from "axios";


export default function Upload() {
    const cloudinary = '';
    const destination= '';

    
    const [fileInputState, setFileInputState] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [selectedFile, setSelectedFile] = useState();
    const [successMsg, setSuccessMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');

    
    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        previewFile(file);
        setSelectedFile(file);
        setFileInputState(e.target.value);
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };

    const handleSubmitFile = (e) => {
      const title = e.target.title.value;
        e.preventDefault();
        if (!selectedFile) return;
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
            uploadImage(reader,title);
            
        };
        reader.onerror = () => {
            console.error('error!');
        };
    };

    const uploadImage = async (reader,title) => {
        try {
          
          // para subir a cloudinary
          const data = new FormData()
          data.append('file', reader.result) 
          data.append('upload_preset', destination)
          const res = await fetch(
            cloudinary,
            {
              method: 'POST',
              body: data
            }
          );
          const file = await res.json();
          const url = file.url;
          //para subir local
          Axios({
            method: "POST",
            url: "http://localhost:3001/api/v1/memes",
            data: {
              category: { _id:'5f4aafc7b168d861769a24bb',name: 'soccer', slug: '/soccer'},
              title: title,
              image: JSON.stringify({url}),
            },
            headers: {
              "Content-Type": "application/json",
              authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNTAyZTlhZDZkYWMzMGY5MDAyZjFmOSIsIm5hbWUiOiJQcnVlYmE2NzY3IiwibWFpbCI6Im1haWwiLCJpYXQiOjE1OTkwOTAzNDQsImV4cCI6MTU5OTM0OTU0NH0.sj9ssTi1oaPnfzQPm_5vYUkhVGkKNcEuPu_NWXhTDvo",
            },
          });
          
            setFileInputState('');
            setPreviewSource('');
            setSuccessMsg('Image uploaded ');
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div>
            <h1 className="title">Upload an Meme</h1>
            <form onSubmit={handleSubmitFile} className="form">
            <input
                    id="title"
                    type="title"
                    name="title"
                    placeholder="ingrese titulo"
                    className="form-input"
                />
                <input
                    id="fileInput"
                    type="file"
                    name="image"
                    onChange={handleFileInputChange}
                    value={fileInputState}
                    className="form-input"
                />
                <button className="btn" type="submit">
                    Submit
                </button>
            </form>
            {previewSource && (
                <img
                    src={previewSource}
                    alt="chosen"
                    style={{ height: '250px' }}
                />
            )}
        </div>
    );
}
