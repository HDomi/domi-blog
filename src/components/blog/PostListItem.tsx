"use client";

import style from "@/app/blog/blog.module.scss";
import Link from "next/link";
import { Viewer } from "@toast-ui/react-editor";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useRouter } from "next/navigation";

export interface PostsProps {
  id: number;
  user_id: string;
  user_email: string;
  title: string;
  content: string;
  inserted_at: any;
  liked_count: number;
  thumbnail?: string;
}

const ListPosts = ({ post }: { post: PostsProps }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
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
    <div className={style["post-item"]}>
      <div className={style["info-wrap"]}>
        <div className={style["info-text"]} onClick={() => goDetail()}>
          <h1 className={style["tltle-text"]}>{post.title}</h1>
          <p className={style.date}>
            {dayjs(post.inserted_at).format("YYYY-MM-DD HH:mm")}
          </p>
        </div>
        <button
          className={style["icon-btn"]}
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? "composition-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          D
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
                    <MenuItem onClick={handleClose}>Delete</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
      <div className={`${style.thumnail}`} onClick={() => goDetail()}>
        <Viewer initialValue={post.content} />
      </div>
      <div className={style["post-card-footer"]} onClick={() => goDetail()}>
        <p className={style.email}>{post.user_email}</p>
        <p>{post.liked_count}</p>
      </div>
    </div>
  );
};

export default ListPosts;
