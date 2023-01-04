import React, { useCallback } from "react";
import { Pagination as BootstrapPagination } from "react-bootstrap";
import Loading from "./Loading";

import "./PaginatedList.scss";

export default function PaginatedList({
  items = [],
  renderItem = () => null,
  currentPage = 0,
  lastPage = 0,
  onPageChange = () => {},
  emptyMessage = "The list is empty",
  loading = false
}) {
  const getList = useCallback(() => {
    if (loading) {
      return (
        <div className="empty-list">
          <Loading />
        </div>
      );
    }
    if (!items.length) {
      return (
        <div className="empty-list">
          <h2>{emptyMessage}</h2>
        </div>
      );
    }

    return items.map((item, index) => renderItem(item, index));
  }, [items, renderItem, emptyMessage, loading]);

  return (
    <div className="Paginated-list">
      <div className="list-container">{getList()}</div>
      <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}

export function Pagination({ currentPage, lastPage, onPageChange }) {
  const getItems = useCallback(() => {
    const items = [];

    const radius = 2;
    for (
      let i = Math.max(0, currentPage - radius);
      i <= Math.min(lastPage, currentPage + radius);
      i++
    ) {
      items.push(i);
    }

    if (items[0] !== 0) {
      if (items[0] > 1) {
        items.unshift("...");
      }
      items.unshift(0);
    }

    if (items[items.length - 1] !== lastPage) {
      if (lastPage - items[items.length - 1] > 1) {
        items.push("...");
      }
      items.push(lastPage);
    }

    return items;
  }, [currentPage, lastPage]);

  if (lastPage <= 0) {
    return null;
  }

  return (
    <BootstrapPagination className="no-select">
      <BootstrapPagination.Prev
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
      />
      {getItems().map((item, index) => {
        if (item === "...") {
          return <BootstrapPagination.Ellipsis key={index} />;
        }

        return (
          <BootstrapPagination.Item
            key={index}
            active={item === currentPage}
            onClick={() => onPageChange(item)}
          >
            {item + 1}
          </BootstrapPagination.Item>
        );
      })}
      <BootstrapPagination.Next
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </BootstrapPagination>
  );
}
