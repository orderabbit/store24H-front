import React, { Dispatch, SetStateAction } from "react";
import "./style.css";

interface Props {
  currentPage: number;
  currentSection: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setCurrentSection: Dispatch<SetStateAction<number>>;

  viewPageList: number[];
  totalSection: number;
}

export default function Pagination(props: Props) {
  const { currentPage, currentSection, viewPageList, totalSection } = props;
  const { setCurrentPage, setCurrentSection } = props;


  const onPageClickHandler = (page: number) => {
    setCurrentPage(page);
  };
  const onPreviousClickHandler = () => {
    console.log(currentSection);
    if (currentSection === 1) return;
    const newSection = currentSection - 1;
    setCurrentSection(newSection);
    setCurrentPage((newSection - 1) * 10 + 10);
  };

  const onNextClickHandler = () => {
    console.log(currentSection, totalSection);
    if (currentSection === totalSection) return;
    const newSection = currentSection + 1;
    setCurrentSection(newSection);
    setCurrentPage((newSection - 1) * 10 + 1);
  };
  return (
    <div id="pagination-wrapper">
      <div className="pagination-change-link-box">
        <div className="icon-box-small">
          <div
            className="pagination-change-link-text"
            onClick={onPreviousClickHandler}
          >
            {"이전"}
          </div>
        </div>
        <div className="pagination-divider">{"|"}</div>
        {viewPageList.map((page) =>
          page === currentPage ? (
            <div className="pagination-text-active" key={page}>
              {page}
            </div>
          ) : (
            <div
              className="pagination-text"
              key={page}
              onClick={() => onPageClickHandler(page)}
            >
              {page}
            </div>
          )
        )}
        <div className="pagination-divider">{"|"}</div>
        <div className="pagination-change-link-box">
          <div
            className="pagination-change-link-text"
            onClick={onNextClickHandler}
          >
            {"다음"}
          </div>
          <div className="icon-box-small"></div>
        </div>
      </div>
    </div>
  );
}