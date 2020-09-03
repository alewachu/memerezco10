import React, { useState } from 'react'

//import '../App.scss'

function Upload() {
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)

  const uploadImage = async e => {
    const files = e.target.files
    const data = new FormData()
    data.append('file', files[0]) 
    data.append('upload_preset', '-')
    setLoading(true)
    const res = await fetch(
      'http://imagenurl ',
      {
        method: 'POST',
        body: data
      }
    )
    const file = await res.json()

    setImage(file.secure_url)
    setLoading(false)
  }

  return (
    <div className="Upload">
      <h1>Upload Meme</h1>
      <input type="text" name="title" placeholder="Titulo"/>
      <input name="category" placeholder="category"  />
      <input
        type="file"
        name="file"
        placeholder="Upload an image"
        onChange={uploadImage}
      />
      
      {loading ? (
        <h3>Subiendo...</h3>
      ) : (
        <img src={image} style={{ width: '300px' }} />
      )}
      
    </div>
  )
}

export default Upload