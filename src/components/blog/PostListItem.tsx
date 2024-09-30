"use client";

import style from "@/app/blog/blog.module.scss";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { deletePostApi } from "@/services/blogApi";
import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import { IPostsProps } from "@/types";

const ListPosts = ({
  post,
  refreshList,
}: {
  post: IPostsProps;
  refreshList: any;
}) => {
  const router = useRouter();
  const { setUserLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (event: any) => {
    event.stopPropagation();
    setOpen((prevOpen) => !prevOpen);
  };
  const handleDelete = async (e: any, id: number) => {
    e.stopPropagation();
    try {
      setUserLoading(true);
      const state = await deletePostApi(id);
      if (state) {
        refreshList();
      }
    } catch (error: any) {
    } finally {
      setUserLoading(false);
    }
  };
  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };
  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const goDetail = () => {
    router.push(`/blog/detail/${post.id}`);
  };

  return (
    <div className={style["post-item"]} onClick={goDetail}>
      <h1 className={style["tltle-text"]}>{post.title}</h1>
      <div className={style["info-wrap"]}>
        <button
          className={style["icon-btn"]}
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? "composition-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          H
        </button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="top-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem onClick={(e) => handleDelete(e, post.id)}>
                      Delete
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <div className={style["info-text"]}>
          <p className={style.category}>{post.category.toUpperCase()}</p>
          <p className={style.date}>
            {dayjs(post.inserted_at).format("YYYY-MM-DD HH:mm")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListPosts;
