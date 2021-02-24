import React, { useState } from 'react';
import logo from './logo.png';
import './App.css';

const Joi = require('joi');

const regrasDeValidacao = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    repeat_password: Joi.ref('password'),

    access_token: [
        Joi.string(),
        Joi.number()
    ],

    birth_year: Joi.number()
        .integer()
        .min(1900)
        .max(2013),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
    .with('username', 'birth_year') // vincular regras
    .xor('password', 'access_token') // OU um pass ou acces_token
    .with('password', 'repeat_password'); // Se for pass vai precisar repeti-lo


regrasDeValidacao.validate({ username: 'abc', birth_year: 1994,  access_token: 'AZbjjJDOj' });
// -> { value: { username: 'abc', birth_year: 1994 } }

regrasDeValidacao.validate({
  username: 'Luciana', birth_year: 1996, access_token: 'AZbjjJDOj'
});
// -> { value: {}, error: '"username" is required' }

// Also -
const positiveMessage = 'Sob Produción';
const repprovedMessage = 'Vucê tá de brincadêrr comig né? Iss tá uma porrcaria';

function App() {

  const [ valido, setValido ] = useState(false);
  const [ nome, setNome ] = useState('');
  const [ nasc, setNasc ] = useState(null);
  const teste = async() => {
    try {
    const value = await regrasDeValidacao.validateAsync({ username: nome, birth_year: nasc, access_token: 'AZbjjJDOj' });
    console.log('É valido?', value);
    if (value) { setValido(true) }
    }
    catch (err) {
      console.log('Deu ruim', err);
      setValido(false);
    }
  };
  teste()

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          { valido ? positiveMessage : repprovedMessage }
        </p>
        <input name="nome" onChange={(valor) => setNome(valor.target.value) } value={nome} type="text"/><br/>
        <input name="nasc" onChange={(valor) => setNasc(valor.target.value) } value={nasc} type="text"/>
        
      </header>
    </div>
  );
}

export default App;
