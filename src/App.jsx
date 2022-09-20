import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement, Tooltip, Legend} from 'chart.js'
// import Chart from './Chart';
import Table from './Table';
import './App.css'

Chart.register(ArcElement,Tooltip,Legend);
function App() {

  // Variables de estado a usar

  // Datos de la tabla
  const [dataT, setDataT] = useState([])
  // Cantidad de vidas del jugador
  const [vidas, setVidas] = useState(6);
  // Cantidad de partidas a simular
  const [cantidadPartidas, setCantidadPartidas] = useState(100);
  // Cantidad de casillas del tablero
  const [cantidadFila, setCantidadFila] = useState(13);
  // tipo de deck a usar
  const [decks, setDecks] = useState('1');


  // Configuracion de la grafica
  const [chartData, setChartData] = useState({
    labels: ['Gano usuario', 'Gano casa'],
    datasets: [
      {
        label: '# veces',
        data: [0, 0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  })

  // Opciones de la grafica
  const [chartOptions, setChartOptions] = useState({
    tooltips: {
        enabled: false
    },
    plugins: {
        datalabels: {
            formatter: (value, ctx) => {
                let sum = 0;
                let dataArr = ctx.chart.data.datasets[0].data;
                dataArr.map(data => {
                    sum += data;
                });
                let percentage = (value*100 / sum).toFixed(2)+"%";
                return percentage;
            },
            color: '#fff',
        }
    }
})



  // Funcion para generar el deck de cartas
  const generateCardDeck = (cantidadCartas=36, tipoDeck=1) => {
    // Valores del deck de cartas
    const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']
    // Palos del deck de cartas
    const cardDeck = [[],[],[]]

    for(let i=0; i<cantidadCartas; i++) {
      //  Elegir al azar un valor de la baraja
      const randomValue = values[Math.floor(Math.random() * values.length)]
      let plano = cardDeck.flat(Infinity)

      // Si el valor existe menos de 4 veces en el deck, agregarlo.
      // Si no, elegir otro valor
      if(plano.filter(value => value === randomValue).length < 4 ) {
        cardDeck[i%3].push(randomValue)
      }
      else{
        i--;
      }
    }

    let plano = cardDeck.flat(Infinity);
    let deckFinal = [[],[],[]];

    // Si el tipo de deck es 1, se retorna el deck tal cual, si no, se hace un shuffle
    if(tipoDeck === '1'){
      deckFinal = cardDeck;
    }else{
      for(let i = 0; i < plano.length; i++){
        // si el tipo de deck es 2, se cambian los valores de 1,2,3,4 por 10,11,12,13 de manera al azar
        if(tipoDeck === '2'){
          if(plano[i] === '1' || plano[i] === '2' || plano[i] === '3' || plano[i] === '4'){
            let valores = ['9', '10', '11', '12', '13'];
            deckFinal[i%3].push(valores[Math.floor(Math.random() * valores.length)])
          }else{
            deckFinal[i%3].push(plano[i])
          }
          // Si el tipo de deck es 3, se cambian los valores de 10,11,12,13 por 1,2,3,4 de manera al azar
        }else if(tipoDeck === '3'){
          if(plano[i] === '10' || plano[i] === '11' || plano[i] === '12' || plano[i] === '13'){
            let valores = ['1', '2', '3', '4'];
            deckFinal[i%3].push(valores[Math.floor(Math.random() * valores.length)])
          }else{
            deckFinal[i%3].push(plano[i])
          }
        }
      }
    }
    

    return deckFinal;
  }

  // Funcion para simular lar partidas
  const simulacion = () => {
    // Se limpia la tabla
    setDataT([])

    // Contadores para la grafica y descripcion de la simulacion
    let ganoUsuarioCounter = 0
    let ganoCasaCounter = 0
    let descripcionPartidas = []
    
    // Por cada iteracion del juego
    for(let i=0; i<cantidadPartidas; i++) {
      // Generamos un nuevo deck con el tipo de deck elegido
      let cardDeck = generateCardDeck(36,decks);

      // Damos un nombre al jugador
      let Jugador = `Jugador ${i+1}`
      // Lista de movimientos del jugador
      let movimientos = []
      // Cantidad de vidas del jugador
      let cantidadVidas = vidas
      let llego = 0

      // Por cada paso del puente
      for(let pos=0; pos<cantidadFila; pos++) {
        // Elejimos de que palo vamos a sacar la carta
        let filaCarta = Math.floor(Math.random()*3+1)
        movimientos.push("Se mueve a columna " + filaCarta)
        // Sacamos la carta del palo elegido
        let carta = cardDeck[filaCarta-1].pop()
        movimientos.push(`Carta ${carta}`)
        // tiramos el dado
        let dado = Math.floor(Math.random()* (12 - 2 + 1) + 2)
        movimientos.push(`DADO: ${dado}`)


        // Si la carta es menor que el dado, pierde una vida
        if(carta < dado) {
          movimientos.push(`Perdio una vida, quedan ${cantidadVidas-1}`)
          cantidadVidas--
        }else{ // Si la carta es mayor que el dado, gana esa iteracion
          movimientos.push(`Ganaste iteracion ${pos+1}`)
        }
        // Si ya no tiene vidas, pierde la partida
        if(cantidadVidas === 0) {
          movimientos.push(`Perdiste la partida`)
          llego = pos
          ganoCasaCounter++
          break;
        }
        
      }
      // Si llego a la ultima iteracion, gana la partida
      if(cantidadVidas > 0) {
        movimientos.push(`Ganaste la partida`)
        ganoUsuarioCounter++
        llego = 13
      }


      descripcionPartidas.push({Jugador, llego , movimientos})

      setDataT((dataT) => [...dataT, {Jugador, llego,movimientos}])
      // console.log("dataT", dataT)
    }

    setChartData(
      {
        labels: ['Gano usuario', 'Gano casa'],
        datasets: [
          {
            label: '# veces',
            data: [ganoUsuarioCounter, ganoCasaCounter],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1,
          },
        ],
      }
    )

    // console.log(chartData)
    

  }




  const handleChangeInput = (e) => {
   setVidas(e.target.value)
  //  console.log(vidas)
  }

  const handleChangeInput2 = (e) => {
    setCantidadPartidas(e.target.value)
   //  console.log(vidas)
   }
  
   const handleChangeInput3 = (e) => {
    setCantidadFila(e.target.value)
   //  console.log(vidas)
   }

   const handleChangeInput4 = (e) => {
    if(e.target.value === '1' || e.target.value === '2' || e.target.value === '3'){
      setDecks(e.target.value)
    }else{
      alert("Solo se puede ingresar 1, 2 o 3")
    }
   }

  return (
    <div className="App">
      
      <h1>Simulación Juego del Calamar</h1>
      <div className="restricciones">
        <div className="row">
          <div className="col">
            <h3>vidas</h3>
          </div>
          <div className="col">
            <input type="number" value ={vidas} onChange={handleChangeInput}/>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h3>Largo del puente</h3>
          </div>
          <div className="col">
            <input type="number" value ={cantidadFila} onChange={handleChangeInput3}/>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h3>Cantidad Partidas</h3>
          </div>
          <div className="col">
            <input type="number" value ={cantidadPartidas} onChange={handleChangeInput2}/>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h3>Tipo Deck</h3>
            <p>1:normal , 2:altas, 3:bajas</p>
          </div>
          <div className="col">
            <input type="number" value ={decks} onChange={handleChangeInput4}/>
          </div>
        </div>
        <button onClick={() => { 
          simulacion()}}>Simulacion</button>
      </div>
      <div className="resultados">
        <div className = "column">
          <Doughnut data={chartData} options={chartOptions}/>
        </div>
        <div className='column'>
          <h2>Resultados</h2>
          <p>Gano usuario: {chartData.datasets[0].data[0]}</p>
          <p>Gano casa: {chartData.datasets[0].data[1]}</p>
          <p>Porcentaje de Ganancia (casa) : {((chartData.datasets[0].data[1]/cantidadPartidas)*100).toFixed(2)}%</p>
        </div>
      </div>
      <div className="partidas">
          
          <Table data = {dataT}/>
          
      </div>
    </div>
  )
}

export default App
