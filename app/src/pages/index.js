import * as React from 'react';
import Head from 'next/head'
import { Container, Row, Modal } from 'react-bootstrap'

import { parseLotteryData, checkForWinnerTicket } from 'src/helpers'


function ResultsModal(props) {
  const { checked, lotteryData, ...otherProps } = props;

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
        <div>
          {checkForWinnerTicket(checked, lotteryData).map(item => (
            <p key={item.contestNumber}>
              {item.firstLine} <br />
              {item.secondLine}
            </p>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={props.onHide}>Close</button>
      </Modal.Footer>
    </Modal>
  );
}

export async function getStaticProps() {
  const fs = require('fs');
  const lotteryData = JSON.parse(fs.readFileSync('src/data/resultados.json', { encoding: 'utf8', flag: 'r' }));

  return {
    props: {
      lotteryData: parseLotteryData(lotteryData)
    },
  }
}

export default function Index(props) {
  const [checked, setChecked] = React.useState([1, 10, 27, 36, 37, 45]);
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
      <Row className="justify-content-md-between" key={`row-${indexList[0]}`}>
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
          <div >
            <button
              type="button"
              disabled={checked.length !== 6}
              onClick={() => setModalShow(true)}
            >
              Verificar
            </button>
            <ResultsModal
              show={modalShow}
              onHide={() => setModalShow(false)}
              checked={checked}
              lotteryData={props.lotteryData}
            />

          </div>
        </Container>
      </main>
      <footer className="cntr-footer">
        By Jerome Vonk - {`${props.lotteryData.length} concursos carregados`}
      </footer>
    </Container>
  )
}