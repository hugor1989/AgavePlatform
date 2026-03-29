import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

export const alert = {
  success: (title: string, text?: string) =>
    Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: '#16a34a', // verde
    }),

  error: (title: string, text?: string) =>
    Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#dc2626', // rojo
    }),

  info: (title: string, text?: string) =>
    Swal.fire({
      icon: 'info',
      title,
      text,
      confirmButtonColor: '#3b82f6', // azul
    }),

  confirm: async (title: string, text?: string) => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#dc2626',
    })
    return result.isConfirmed
  },
}
