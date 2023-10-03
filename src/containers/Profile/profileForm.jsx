// PostForm.js
import React, { useState } from 'react';

function ProfileForm({ onAddPost }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí debes enviar los datos del nuevo post al servidor o realizar la lógica necesaria.
    // Luego, puedes llamar a la función onAddPost para agregar la publicación a la lista.
    const newPost = { title, content };
    onAddPost(newPost);
    // Limpiar los campos después de agregar la publicación
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título del post"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Contenido del post"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Agregar</button>
    </form>
  );
}

export default ProfileForm;
