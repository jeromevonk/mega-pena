import * as React from 'react';
import Head from 'next/head'
import getConfig from 'next/config';
import { Container, Row, Modal } from 'react-bootstrap'
import { checkForWinnerTicket } from 'src/helpers'

export async function getServerSideProps() {
  const { publicRuntimeConfig } = getConfig();
  const res = await fetch(`${publicRuntimeConfig.apiUrl}/lottery-data`);
  const lotteryData = await res.json();

  return {
    props: {
      lotteryData
    },
  }
}

export default function Index(props) {
  const [checked, setChecked] = React.useState([]);
  const [modalShow, setModalShow] = React.useState(false);

  const handleToggle = (index) => {
    if (checked.includes(index)) {
      // Uncheck
      setChecked(prev => {
        const i = prev.indexOf(index);

        if (i > -1) {
          prev.splice(i, 1);
        }

        return [...prev];
      })
    } else {
      if (checked.length > 5) {
        // It's full. Return?
      } else {
        setChecked(prev => {
          prev.push(index)
          return [...prev];
        })
      }
    }
  }

  // -------------------------------------------------
  // Generate a grid of 6 * 10 buttons, numbered
  // from 1 to 60
  // -------------------------------------------------
  const getRowOfButtons = (indexList) => {
    return (
      <Row key={`row-${indexList[0]}`}>
        {
          indexList.map(index => (
            <button
              type="button"
              key={index}
              className={checked.includes(index) ? 'untoggled-button-active' : 'untoggled-button'}
              onClick={() => handleToggle(index)}
            >
              {index}
            </button>
          ))
        }
      </Row>)
  }

  const createIndexes = (startingIndex) => {
    // Array(10).keys() will generate [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    // We need to add 1 and them, add startingIndex * 10
    return [...Array(10).keys()].map((x => (x + 1) + startingIndex * 10))
  }

  const getButtonGrid = () => {
    const buttons = [];
    for (let i = 0; i <= 5; i++) {
      buttons.push(getRowOfButtons(createIndexes(i)));
    }

    return buttons;
  }

  const numContests = props.lotteryData.length;

  return (
    <Container className="md-container">
      <Head>
        <title>Mega-pena!</title>
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>
      <main>
        <Container>
          <h1 className="title">
            mega-pena
          </h1>
          <Container className='game'>
            {
              getButtonGrid()
            }
          </Container>
          <Container className='info'>
            {numContests} concursos | último em {props.lotteryData[0].date}
          </Container>
          <Container className='actions'>
            <Row>
              <button
                className='clear'
                type="button"
                disabled={checked.length === 0}
                onClick={() => setChecked([])}
              >
                Limpar
              </button>
              <button
                className='verify'
                type="button"
                disabled={checked.length !== 6}
                onClick={() => setModalShow(true)}
              >
                Verificar
              </button>

            </Row>
            <ResultsModal
              show={modalShow}
              onHide={() => setModalShow(false)}
              checked={checked}
              lotteryData={props.lotteryData}
            />
          </Container>

        </Container>
      </main>
      <footer className="cntr-footer">
        By Jerome Vonk
      </footer>
    </Container>
  )
}

function ResultsModal(props) {
  const { checked, lotteryData, ...otherProps } = props;

  const results = checkForWinnerTicket(checked, lotteryData);

  return (
    <Modal
      {...otherProps}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className='modal-title'>
          Resultados
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{checked.sort().map(item => `${item} `)}</h4>
        <div>
          {
            results.length > 0 ?

              // Show results
              results.map(item => (
                <p key={item.contestNumber}>
                  {item.firstLine} <br />
                  {item.secondLine}
                </p>
              ))

              :

              // No results! Show a message
              <p> A combinação nunca foi premiada!</p>
          }
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={props.onHide}>Close</button>
      </Modal.Footer>
    </Modal >
  );
}