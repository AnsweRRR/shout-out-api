import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import { RegisterDto } from 'src/@types/user';
import axios from '../utils/axios';
import localStorageAvailable from '../utils/localStorageAvailable';
import { isValidToken, setSession } from './utils';
import { ActionMapType, AuthStateType, AuthUserType, JWTContextType } from './types';

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REFRESHTOKEN = 'REFRESHTOKEN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
  UPDATE_POINTS_TO_HAVE = "UPDATE_POINTS_TO_HAVE",
  UPDATE_POINTS_TO_GIVE = "UPDATE_POINTS_TO_GIVE",
}

type Payload = {
  [Types.INITIAL]: {
    isAuthenticated: boolean;
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REFRESHTOKEN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
  [Types.UPDATE_POINTS_TO_HAVE]: {
    user: AuthUserType;
  };
  [Types.UPDATE_POINTS_TO_GIVE]: {
    user: AuthUserType;
  };
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REFRESHTOKEN) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }

  if (action.type === Types.UPDATE_POINTS_TO_HAVE) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const storageAvailable = localStorageAvailable();

  // useEffect(() => {
  //   const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';

  //   setInterval(() => {
  //     if (accessToken && isValidToken(accessToken)) {
  //       refreshToken(accessToken);
  //       console.log(accessToken);
  //     }
  //   }, 5000)

  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const response = await axios.get('/api/user/my-account');

        const user = response.data;
        user.accessToken = accessToken;

        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const response = await axios.post('/api/user/login', {
      email,
      password,
    });
    const { accessToken, refreshToken, user } = response.data;

    setSession(accessToken);

    dispatch({
      type: Types.LOGIN,
      payload: {
        user,
      },
    });
  }, []);

  const refreshToken = useCallback(async (access_Token: string) => {
    const headers = {
      'Authorization': `Bearer ${access_Token}`
    };

    const response = await axios.post('/api/user/refresh-token', null, { withCredentials: true, headers });
    const { accessToken, user } = response.data;

    setSession(accessToken);

    dispatch({
      type: Types.REFRESHTOKEN,
      payload: {
        user,
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(
    async (registerDto: RegisterDto) => {
      const response = await axios.post('/api/user/register', registerDto);
      const { accessToken, user } = response.data;

      localStorage.setItem('accessToken', accessToken);

      dispatch({
        type: Types.REGISTER,
        payload: {
          user,
        },
      });
    },
    []
  );

  // LOGOUT
  const logout = useCallback(() => {
    setSession(null);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  const updatePointToHave = useCallback((pointsToHaveAfterClaim: number) => {
    const updatedUser = {
      ...state.user,
      pointToHave: pointsToHaveAfterClaim,
    };
  
    dispatch({
      type: Types.UPDATE_POINTS_TO_HAVE,
      payload: {
        user: updatedUser,
      },
    });
  }, [state.user, dispatch]);

  const updatePointToGive = useCallback((pointsToGiveAfterSend: number) => {
    const updatedUser = {
      ...state.user,
      pointsToGive: pointsToGiveAfterSend,
    };
  
    dispatch({
      type: Types.UPDATE_POINTS_TO_HAVE,
      payload: {
        user: updatedUser,
      },
    });
  }, [state.user, dispatch]);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: 'jwt',
      login,
      register,
      logout,
      updatePointToHave,
      updatePointToGive
    }),
    [state.isAuthenticated, state.isInitialized, state.user, login, logout, register, updatePointToHave, updatePointToGive]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
