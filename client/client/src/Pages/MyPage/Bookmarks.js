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

export default function Bookmarks({ isLogin }) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [currentArticle, setCurrentArticle] = useState([]);
  const paginationHandler = currentPage => {
    // console.log('게시물 요청!!');
    axios
      .get(
        `http://localhost:8080/users/bookmarks?pages=${currentPage}&limit=10`,
        {
          headers: { Accept: 'application/json' },
        },
      )
      .then(response => {
        // console.log('axios 요청', response.data.boards);
        if (response.status === 200) {
          setCurrentArticle(response.data.boards.rows[0].Boards);
          setTotalArticles(response.data.boards.count);
          //console.log(response.data.boards.rows[0].Boards, '응답');
        } else {
          // console.log('게시물부르기실패');
          alert('게시물을 불러오지 못했습니다');
        }
      })
      .catch(error => {
        alert('게시물을 불러오지 못했습니다');
      });
  };

  useEffect(() => {
    setIsLoading(true);
    paginationHandler(currentPage);
    setIsLoading(false);
  }, []);

  return (
    <Box>
      <Routes>
        <Route path="/:id" element={<Article />} />
        <Route
          path="/"
          element={
            <Section>
              <h2>Bookmarks</h2>
              {isLoading ? (
                <LoadingIndicator />
              ) : currentArticle.length !== 0 ? (
                currentArticle.map(article => (
                  <ErrorLog key={article.id} article={article} />
                ))
              ) : (
                <FailIndicator />
              )}
              <Pagination
                totalArticles={totalArticles}
                setCurrentPage={setCurrentPage}
              ></Pagination>
            </Section>
          }
        />
      </Routes>
    </Box>
  );
}
