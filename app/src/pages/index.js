import * as React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head'
import getConfig from 'next/config';
import { Container, Row, Modal } from 'react-bootstrap'
import { checkForWinnerTicket, generateRandomIntegerList } from 'src/helpers'

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
    } else if (checked.length > 5) {
        // It's full. Return?
    } else {
      setChecked(prev => {
        prev.push(index)
        return [...prev];
      })
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
              className={checked.includes(index) ? 'custom-button checked-button' : 'custom-button unchecked-button'}
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
          <Container className='description'>
            Selecione 6 dezenas e veja se já foram
          </Container>
          <Container className='description'>
            premiadas em qualquer concurso anterior.
          </Container>
          <Container className='info'>
            {numContests} concursos | último em {props.lotteryData[0].date}
          </Container>
          <Container>
            <Row>
              <button
                className='white'
                type="button"
                onClick={() => setChecked(generateRandomIntegerList(6))}
              >
                Aleatório
              </button>
              <button
                className='white'
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
                {checked.length === 6 ? 'Verificar' : 'Escolha 6 dezenas'}
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
        <a href="https://jeromevonk.github.io/" target="blank">Feito por Jerome Vonk</a>
      </footer>
    </Container>
  )
}


Index.propTypes = {
  lotteryData: PropTypes.array.isRequired,
};

function ResultsModal(props) {
  const { checked, lotteryData, ...otherProps } = props;

  const results = checkForWinnerTicket(checked, lotteryData);

  return (
    <Modal
      {...otherProps}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className='modal-title'>
          Resultados
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>
          {checked.sort((a, b) => a - b).map(item => <span className="dot" key={item}>{item}</span>)}
        </h4>
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
    </Modal >
  );
}


ResultsModal.propTypes = {
  lotteryData: PropTypes.array.isRequired,
  checked: PropTypes.array.isRequired,
};
