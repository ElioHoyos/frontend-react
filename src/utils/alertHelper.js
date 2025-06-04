import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showSuccessAlert = (title, text) => {
  MySwal.fire({
    icon: 'success',
    title,
    text,
    showConfirmButton: false,
    timer: 2500,
    background: '#f0f9f0',
    color: '#1a5632',
    iconColor: '#28a745',
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
};

export const showErrorAlert = (title, text) => {
  MySwal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'Entendido',
    background: '#fdf3f3',
    color: '#8b1a1a',
    iconColor: '#dc3545',
    confirmButtonColor: '#dc3545'
  });
};


export const showConfirmDialog = (title, text) => {
  return MySwal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar',
    background: '#fff',
    color: '#333',
    reverseButtons: true,
    focusCancel: true
  });
};