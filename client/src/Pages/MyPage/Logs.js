import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import LoadingIndicator from '../../Components/LoadingIndicator';
import ErrorLog from '../../Components/ErrorLog';
import Pagination from '../../Components/Pagination';
import FailIndicator from '../../Components/FailIndicator';
import Article from '../Article/Article';

import styled from 'styled-components';

const Box = styled.div`
  padding: 0 0.5rem;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  > h2 {
    padding: 0 0.3rem;
    margin-bottom: 15px;
    width: 97%;
    text-align: start;
  }
`;

export default function Logs() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [currentArticle, setCurrentArticle] = useState([]); // 화면상에 렌더할 실제 게시물 배열
  const paginationHandler = currentPage => {
    axios
      .get(`http://15.164.104.171/users/boards?pages=${currentPage}&limit=10`, {
        headers: { Accept: 'application/json' },
      })
      .then(response => {
        console.log('axios 요청', response.data.boards);
        if (response.status === 200) {
          setCurrentArticle(response.data.boards.rows);
          setTotalArticles(response.data.boards.count);
        } else {
          console.log('게시물부르기실패');
        }
      })
      .catch(error => {
        console.log('게시글 못받음');
      });
  };
  useEffect(() => {
    setIsLoading(true);
    paginationHandler(currentPage);
    setIsLoading(false);
  }, [currentPage]);
  return (
    <Box className="logs">
      <Routes>
        <Route path="/:id" element={<Article />} /> {/*전체 게시글 프롭스뺌*/}
        <Route
          path="/*"
          element={
            <Section>
              <h2>My Error Logs</h2>
              {isLoading ? (
                <LoadingIndicator />
              ) : currentArticle.length ? (
                currentArticle.map(article => (
                  <ErrorLog key={article.id} article={article} />
                ))
              ) : (
                <FailIndicator />
              )}
              <Pagination
                totalArticles={totalArticles}
                paginate={setCurrentPage}
              ></Pagination>
            </Section>
          }
        />
      </Routes>
    </Box>
  );
}
