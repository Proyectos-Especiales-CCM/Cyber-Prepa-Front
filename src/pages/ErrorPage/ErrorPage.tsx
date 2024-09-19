import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/Constants';
import './ErrorPage.css';

const ErrorPage = () => {
  return (
    <div className="error-page">
    <h1>404 - Página No Encontrada</h1>
    <p>La página que estás buscando no existe.</p>
    <Link to={ROUTES.HOME}>Regresar al inicio</Link>
  </div>
  )
}

export default ErrorPage
