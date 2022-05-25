const codigoInput = document.querySelector("#codigo");
const nombreInput = document.querySelector("#nombre");
const colorInput = document.querySelector("#color");
const pesoInput = document.querySelector("#peso");
const contenedorProductos = document.querySelector(".listado-producto");
const mensajes = document.querySelector(".mensajes");
const totalProductos = document.querySelector('.total-productos')

const formulario = document.querySelector(".formulario");

document.addEventListener("DOMContentLoaded", ()=>{
    codigoInput.addEventListener("change", datosProducto);
    nombreInput.addEventListener("change", datosProducto);
    colorInput.addEventListener("change", datosProducto);
    pesoInput.addEventListener("change", datosProducto);
    

    formulario.addEventListener("submit", guardarProducto);
})

let productoObj = {
    codigo: '',
    nombre: '',
    color: '',
    peso: '',
}

let editando;

class UI{

    mostrarAlerta(mensaje, tipo){

        const existeAlerta = document.querySelector(".alerta");

        if(!existeAlerta){
            const divAlerta = document.createElement("div");
            divAlerta.classList.add("alerta");

            if(tipo === "error"){
                divAlerta.classList.add("alerta-error");
            }else{
                divAlerta.classList.add("alerta-success");
            } 

            divAlerta.textContent = mensaje;
            mensajes.appendChild(divAlerta);

            setTimeout(()=>{
                divAlerta.remove();
            },3000)
        }
    }

    limpiarHTML(){
        while(contenedorProductos.firstChild){
            contenedorProductos.removeChild(contenedorProductos.firstChild);
        }
    }

    mostrarProductos(productos){
        
        this.limpiarHTML();

        productos.forEach( producto =>{

            const {codigo, nombre, color, peso, id} = producto;

            const row = document.createElement("li");
            row.classList.add("widget-producto");

            const codigoProducto = document.createElement("span");
            codigoProducto.classList.add("widget-producto__nombre");
            codigoProducto.textContent = codigo;

            const cod = document.createElement("p")
            cod.classList.add("widget-producto__campo");
            cod.textContent = "Codigo: "

            const nombreProducto = document.createElement("span")
            nombreProducto.classList.add("widget-producto__valor");
            nombreProducto.textContent = nombre;

            const nom = document.createElement("p")
            nom.classList.add("widget-producto__campo");
            nom.textContent = "Nombre del producto: "

            const colorProducto = document.createElement("span")
            colorProducto.classList.add("widget-producto__valor");
            colorProducto.textContent = color;

            const col = document.createElement("p")
            col.classList.add("widget-producto__campo");
            col.textContent = "Color: "

            const pesoProducto = document.createElement("span")
            pesoProducto.classList.add("widget-producto__valor");
            pesoProducto.textContent = peso;

            const pes = document.createElement("p")
            pes.classList.add("widget-producto__campo");
            pes.textContent = "Peso: "

            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add("btn","btn-red");
            btnEliminar.textContent = "Eliminar";

            const btnEditar = document.createElement("button");
            btnEditar.classList.add("btn","btn-success");
            btnEditar.textContent = "Editar"

            btnEliminar.onclick = () =>{
                eliminarProducto(id);
            }

            btnEditar.onclick = () =>{
                editarProducto(producto);
            }

            cod.appendChild(codigoProducto);
            nom.appendChild(nombreProducto);
            col.appendChild(colorProducto);
            pes.appendChild(pesoProducto);
           

            row.appendChild(cod);
            row.appendChild(nom);
            row.appendChild(col);
            row.appendChild(pes);
            row.appendChild(btnEliminar);
            row.appendChild(btnEditar);

            contenedorProductos.prepend(row);
        })

        totalProductos.textContent = `(${productos.length}) productos`;
    }
}

class Productos{
    constructor(){
        this.productos = [];
    } 

    nuevoProducto({...productoObj}){
        this.productos = [...this.productos, {...productoObj}]
    }

    borrarProducto(id){
        this.productos = this.productos.filter( producto => producto.id !== id);
    }

    editarProducto({...productoActualizado}){
       this.productos = this.productos.map(producto => productoActualizado.id === producto.id ? productoActualizado : producto)
    }
}

const ui = new UI();
const administrador = new Productos();


function datosProducto(e){
    productoObj[e.target.name] = e.target.value;
}


function guardarProducto(e){
    e.preventDefault();
    const {codigo, nombre, color, peso } = productoObj;

    if(codigo === '' || nombre === '' || color === '' || peso === ''){
        ui.mostrarAlerta("Todos los campos son obligatorios", "error");
        return;
    }

    if(editando){
        administrador.editarProducto({...productoObj});
        formulario.querySelector('input[type="submit"]').value = "Agregar producto";
        ui.mostrarAlerta("Producto actualizado correctamente");
        editando = false;
    }else{
        productoObj.id = Date.now();
        administrador.nuevoProducto({...productoObj}) 
        ui.mostrarAlerta("Producto agregado correctamente");
    }

    const {productos} = administrador;
    formulario.reset();
    reiniciarObjeto();
    ui.mostrarProductos(productos);
    
}

function reiniciarObjeto(){
    productoObj.codigo = '';
    productoObj.nombre = '';
    productoObj.color = '';
    productoObj.peso = '';
}

function eliminarProducto(id){
    administrador.borrarProducto(id);
    const {productos} = administrador;
    ui.mostrarProductos(productos);
}

function editarProducto(producto){

    const {codigo, nombre, color, peso, id} = producto;

    codigoInput.value = codigo;
    nombreInput.value = nombre;
    colorInput.value = color;
    pesoInput.value = peso;
    

    productoObj.codigo = codigo;
    productoObj.nombre = nombre;
    productoObj.color = color;
    productoObj.peso = peso;
    productoObj.id = id;

    formulario.querySelector('input[type="submit"]').value = "Guardar cambios";

    editando = true;
}
