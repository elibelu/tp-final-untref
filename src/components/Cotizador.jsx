import { Link } from "react-router-dom";
import { FaClipboardList } from "react-icons/fa6";
import Opciones from "./Opciones";
import { useEffect, useState } from "react";
import useCotizador from "../hooks/useCotizador";
import usePresupuestos from "../hooks/usePresupuestos";
import Swal from "sweetalert2";

const Cotizador = () => {
  const [precio, setPrecio] = useState(0);
  const [datos, setDatos] = useState([]);
  const {elementos, setElementos} = useCotizador();
  const {presupuestos, setPresupuestos} = usePresupuestos();
  const realizarCotizacion = () => {
    const {metros, propiedad, ubicacion} = elementos;
    if(metros < 20 || propiedad == 0 || ubicacion == 0) {
      Swal.fire("Error", "Debes completar bien los datos", "error");
    }
    const cuenta = 35.86 * metros * propiedad * ubicacion;
    setPrecio(cuenta);
  };
  const guardar = () => {
     setPresupuestos([
      ...presupuestos, 
      {
      fecha:new Date().toDateString(),
      ...elementos,
      cuenta: 35.86 * elementos.metros * elementos.propiedad * elementos.ubicacion
     },
    ]);
    setPrecio(0);
  }
  useEffect (() => {
    const leer = async () => setDatos(await (await fetch("/data.json")).json()) ;
     leer();
  }, []);
  return (
   <>
    <nav>
    <Link to= {"/presupuestos"}>
      <FaClipboardList />
    </Link>
    </nav>

    <form action="" onSubmit={(e) => e.preventDefault()}>
      <Opciones 
      datos={datos.filter(({ categoria }) => categoria == "propiedad")} 
      label={"Selecciona el tipo de Propiedad"} 
      tipo={"propiedad"} 
      />
      <Opciones 
      datos={datos.filter(({ categoria }) => categoria == "ubicacion")} 
      label={"Selecciona su ubicación"} 
      tipo={"ubicacion"} 
      />
      <label htmlFor="metros">Ingresa los metros cuadrados</label>
      <input 
      type="number" 
      id="metros" 
      min={20}
      defaultValue={20} 
      onImput={(e) => 
        setElementos ({
          ...elementos, 
          metros: isNaN (parseInt(e.target.value)) 
          ? 20
          : parseInt(e.target.value) <20 
          ? 20
          :parseInt(e.target.value), 
        })
      } 
      />
      <button type="button" onClick={realizarCotizacion}>
        Cotizar
      </button>
    </form>

    {precio != 0 && (
    <>
       <p>El precio estimado es de ${precio.toFixed(2)} </p> 
       <form onSubmit={e => e.preventDefault()}>
        <button type="button" onClick={guardar}>Guardar
        </button>
       </form>
    </>
    )}

   </>
  );
};
export default Cotizador;