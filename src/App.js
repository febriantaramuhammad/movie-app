import React, { useEffect, useState } from "react";
import {
  Layout,
  Input,
  Row,
  Col,
  Card,
  Tag,
  Spin,
  Alert,
  Modal,
  Typography
} from "antd";
import "antd/dist/antd.css";

const API_KEY = "b76b385c";
const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Meta } = Card;
const TextTitle = Typography.Title;

const SearchBox = ({ searchHandler }) => {
  return (
    <Row>
      <Col span={10} offset={6}>
        <Search
          placeholder="enter movie"
          enterButton="Search"
          size="large"
          onSearch={value => searchHandler(value)}
        />
        <br></br>
        <br></br>
        <Search
          placeholder="enter year"
          enterButton="Search"
          size="large"
          onSearch={value => searchHandler(value)}
        />
      </Col>
    </Row>
  );
};

const ColCardBox = ({
  Title,
  imdbID,
  Poster,
  Type,
  ShowDetail,
  DetailRequest,
  ActivateModal
}) => {
  const clickHandler = () => {
    // Display Modal and Loading Icon
    ActivateModal(true);
    DetailRequest(true);

    fetch(
      `http://www.omdbapi.com/?s=indiana&apikey=b76b385c&page=1&type=movie&Content-Type=application/json`
    )
      .then(resp => resp)
      .then(resp => resp.json())
      .then(response => {
        DetailRequest(false);
        ShowDetail(response);
      })
      .catch(({ message }) => {
        DetailRequest(false);
      });
  };

  return (
    <Col style={{ margin: "20px 0" }} className="gutter-row" span={4}>
      <div className="gutter-box">
        <Card
          style={{ width: 150 }}
          cover={
            <img
              alt={Title}
              src={
                Poster === "N/A"
                  ? "https://placehold.it/198x264&text=Image+Not+Found"
                  : Poster
              }
            />
          }
          onClick={() => clickHandler()}
        >
          <Meta title={Title} description={false} />
          <Row style={{ marginTop: "10px" }} className="gutter-row">
            <Col>
              <Tag color="#3e78b3">{Type}</Tag>
            </Col>
          </Row>
        </Card>
      </div>
    </Col>
  );
};

const MovieDetail = ({
  Title,
  Poster,
  imdbRating,
  Rated,
  Runtime,
  Genre,
  Plot,
  Year
}) => {
  return (
    <Row>
      <Col span={11}>
        <img
          src={
            Poster === "N/A"
              ? "https://placehold.it/198x264&text=Image+Not+Found"
              : Poster
          }
          alt={Title}
        />
      </Col>
      <Col span={13}>
        <Row>
          <Col span={21}>
            <TextTitle level={4}>{Title}</TextTitle>
          </Col>
          <Col span={3} style={{ textAlign: "right" }}>
            <TextTitle level={4}>
              <span style={{ color: "##3e78b3" }}>{imdbRating}</span>
            </TextTitle>
          </Col>
        </Row>
        <Row style={{ marginBottom: "20px" }}>
          <Col>
            <Tag>{Rated}</Tag>
            <Tag>{Runtime}</Tag>
            <Tag>{Genre}</Tag>
            <Tag>{Year}</Tag>
          </Col>
        </Row>
        <Row>
          <Col>{Plot}</Col>
        </Row>
      </Col>
    </Row>
  );
};

const Loader = () => (
  <div style={{ margin: "20px 0", textAlign: "center" }}>
    <Spin />
  </div>
);

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [q, setQuery] = useState("frozen");
  const [activateModal, setActivateModal] = useState(false);
  const [detail, setShowDetail] = useState(false);
  const [detailRequest, setDetailRequest] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setData(null);

    fetch(`http://www.omdbapi.com/?s=${q}&apikey=${API_KEY}`)
      .then(resp => resp)
      .then(resp => resp.json())
      .then(response => {
        if (response.Response === "False") {
          setError(response.Error);
        } else {
          setData(response.Search);
        }

        setLoading(false);
      })
      .catch(({ message }) => {
        setError(message);
        setLoading(false);
      });
  }, [q]);

  return (
    <div className="App">
      <Layout className="layout">
        <Header>
          <div style={{ textAlign: "center", color: "#ffffff" }}>
            <TextTitle
              style={{ color: "#ffffff", marginTop: "14px" }}
              level={3}
            >
              Movie Information Web App
            </TextTitle>
          </div>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <div style={{ background: "#000000", padding: 24, minHeight: 280 }}>
            <SearchBox searchHandler={setQuery} />
            <br />

            <Row gutter={16} type="flex" justify="center">
              {loading && <Loader />}

              {error !== null && (
                <div style={{ margin: "20px 0" }}>
                  <Alert message={error} type="error" />
                </div>
              )}

              {data !== null &&
                data.length > 0 &&
                data.map((result, index) => (
                  <ColCardBox
                    ShowDetail={setShowDetail}
                    DetailRequest={setDetailRequest}
                    ActivateModal={setActivateModal}
                    key={index}
                    {...result}
                  />
                ))}
            </Row>
          </div>
          <Modal
            title="Detail"
            centered
            visible={activateModal}
            onCancel={() => setActivateModal(false)}
            footer={null}
            width={800}
          >
            {detailRequest === false ? <MovieDetail {...detail} /> : <Loader />}
          </Modal>
        </Content>
        <Footer
          style={{
            background: "#ffffff",
            padding: 24,
            minHeight: 10,
            textAlign: "left"
          }}
        >
          Created by : Febriantara Muhammad @copyright 2019
        </Footer>
      </Layout>
    </div>
  );
}

export default App;
