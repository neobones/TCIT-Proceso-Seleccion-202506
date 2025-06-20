import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '@frameworks-drivers/state/store';

// Typed hooks para usar en toda la aplicación
// Compatible con react-redux 8.1.1
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 