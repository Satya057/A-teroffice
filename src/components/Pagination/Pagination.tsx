import { useEffect, useState, useCallback } from "react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { CommentType } from "../../types";

interface PaginateProps {
  totalPages: number;
  commentsPagination: (page: number) => void;
  comments: CommentType[];
}

const PaginationButton = ({ children, onClick, disabled = false }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) => (
  <span onClick={onClick} style={{ cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1 }}>
    {children}
  </span>
);

const Paginate = ({ totalPages, commentsPagination, comments }: PaginateProps) => {
  const [currPage, setCurrPage] = useState<number>(1);

  useEffect(() => {
    commentsPagination(currPage);
  }, [currPage, comments, commentsPagination]);

  const prevClickHandler = useCallback(() => {
    if (currPage > 1) {
      setCurrPage(currPage - 1);
    }
  }, [currPage]);

  const nextClickHandler = useCallback(() => {
    if (currPage < totalPages) {
      setCurrPage(currPage + 1);
    }
  }, [currPage, totalPages]);

  const jumpToPage = useCallback((page: number) => {
    setCurrPage(page);
  }, []);

  return (
    <div style={{ margin: "10px 0px", display: 'flex', alignItems: 'center' }}>
      <PaginationButton onClick={prevClickHandler} disabled={currPage <= 1}>
        <ArrowBackIosIcon sx={{ marginTop: "2px" }} />
      </PaginationButton>
      {Array.from({ length: totalPages }, (_, id) => (
        <PaginationButton
          key={id}
          onClick={() => jumpToPage(id + 1)}
        >
          <span
            style={{
              borderRadius: "50%",
              padding: "4px 8px",
              backgroundColor: id + 1 === currPage ? "#bfbfbf" : "",
              margin: "0px 3px",
            }}
          >
            {id + 1}
          </span>
        </PaginationButton>
      ))}
      <PaginationButton onClick={nextClickHandler} disabled={currPage >= totalPages}>
        <ArrowForwardIosIcon sx={{ marginTop: "2px" }} />
      </PaginationButton>
    </div>
  );
};

export default Paginate;
