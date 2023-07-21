import React from 'react';
import {Redirect, Route} from 'react-router-dom';

export default function ProtectedRoute({component: Component, access, redirectTo, ...rest}) {
  return (
    <Route {...rest} render={
      props => {
        if (access) {
          return <Component {...rest} {...props} />
        } else {
          return <Redirect to={redirectTo}/>
        }
      }
    }/>
  )
}