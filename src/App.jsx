import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement, Tooltip, Legend} from 'chart.js'
// import Chart from './Chart';
import Table from './Table';
import './App.css'

Chart.register(ArcElement,Tooltip,Legend);
function App() {
  const [dataT, setDataT] = useState([])
  const [vidas, setVidas] = useState(6);
  const [cantidadPartidas, setCantidadPartidas] = useState(100);
  const [cantidadFila, setCantidadFila] = useState(13);

  const [decks, setDecks] = useState('1');

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
    const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']
    const cardDeck = [[],[],[]]
    for(let i=0; i<cantidadCartas; i++) {
      const randomValue = values[Math.floor(Math.random() * values.length)]
      let plano = cardDeck.flat(Infinity)
      if(plano.filter(value => value === randomValue).length < 4 ) {
        cardDeck[i%3].push(randomValue)
      }else{
        i--;
      }
    }
    let plano = cardDeck.flat(Infinity);

    let deckFinal = [[],[],[]];
    if(tipoDeck === '1'){
      deckFinal = cardDeck;
    }else{
      for(let i = 0; i < plano.length; i++){
        if(tipoDeck === '2'){
          if(plano[i] === '1' || plano[i] === '2' || plano[i] === '3' || plano[i] === '4'){
            let valores = ['9', '10', '11', '12', '13'];
            deckFinal[i%3].push(valores[Math.floor(Math.random() * valores.length)])
          }else{
            deckFinal[i%3].push(plano[i])
          }
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
    setDataT([])
    let ganoUsuarioCounter = 0
    let ganoCasaCounter = 0
    let descripcionPartidas = []
    // console.log(generateCardDeck())
    let tempDeck = generateCardDeck(36, decks);
    console.table(tempDeck)
    for(let i=0; i<cantidadPartidas; i++) {
      let cardDeck = generateCardDeck(36,decks);

      let Jugador = `Jugador ${i+1}`

      let movimientos = []
      
      let cantidadVidas = vidas
      let llego = 0
      for(let pos=0; pos<cantidadFila; pos++) {

        let filaCarta = Math.floor(Math.random()*3+1)
        movimientos.push("Se mueve a columna " + filaCarta)
        let carta = cardDeck[filaCarta-1].pop()
        movimientos.push(`Carta ${carta}`)

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
