import { useState } from "react";
import { Icons, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationCenter } from "react-toastify/addons/use-notification-center";
import styled from "styled-components";

import Trigger from "./Trigger";
import ItemActions from "./ItemActions/ItemActions";
import TimeTracker from "./TimeTracker";

const variants = {
  container: {
    open: {
      y: 0,
      opacity: 1,
      pointerEvents: "auto",
    },
    closed: {
      y: -10,
      opacity: 0,
      pointerEvents: "none",
    },
  },
  // used to stagger item animation when switching from closed to open and vice versa
  content: {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  },
  item: {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  },
};

const OuterWrapper = styled.div`
  position: relative;
`;

const Container = styled(motion.div)`
  width: min(60ch, 100ch);
  border-radius: 8px;
  overflow: hidden;
  position: absolute;
  top: 80px;
  right: -50px;
`;

const Footer = styled.footer`
  background: #222;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Content = styled(motion.section)`
  background: #fff;
  height: 400px;
  overflow-y: scroll;
  overflow-x: hidden;
  color: #000;
  padding: 0.2rem;
  position: relative;
  h5 {
    margin: 0;
    text-align: center;
    padding: 2rem;
    color: grey;
  }
`;

const IconWrapper = styled.div`
  svg {
    width: 32px;
  }
`;

const Item = styled(motion.article)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const Header = styled.header`
  background: #222;
  color: #fff;
  margin: 0;
  padding: 10px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FooterButton = styled.button`
  height: 32px;
  font-size: 14px;
  padding: 0;
  border-radius: 5px;
  background-color: #569e9e;
  border: none !important;
  margin: auto;
  :hover {
    background-color: #5fafaf;
  }
`;

const FooterButtonSecondary = styled(FooterButton)`
  background-color: #343444;
  :hover {
    background-color: #2d2d3b;
  }
`;

const NotificationContent = styled.div`
  font-size: 14px;
`;

const Button = styled.button`
  cursor: pointer;
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  width: min-content !important;
  :hover {
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
  }
`;

const Close = styled.i`
  font-size: 24px;
  color: #fff;
  transition: color 0.15s linear;
  :hover {
    color: red;
  }
`;

const NotificationCenter = () => {
  const { notifications, clear, markAllAsRead, markAsRead, remove, unreadCount } =
    useNotificationCenter();
  const [showUnreadOnly, toggleFilter] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <OuterWrapper>
      <Trigger onClick={() => setIsOpen(!isOpen)} count={unreadCount} />
      <Container
        initial={false}
        variants={variants.container}
        animate={isOpen ? "open" : "closed"}
      >
        <Header>
          <h4>Notifications</h4>

          <Button onClick={() => setIsOpen(false)} title="Close">
            <Close className="fal fa-times"></Close>
          </Button>
        </Header>
        <AnimatePresence>
          <Content variants={variants.content} animate={isOpen ? "open" : "closed"}>
            {(!notifications.length || (unreadCount === 0 && showUnreadOnly)) && (
              <motion.h5
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                You have no recent notifications.
              </motion.h5>
            )}
            <AnimatePresence>
              {(showUnreadOnly
                ? notifications.filter((v) => !v.read)
                : notifications
              ).map((notification) => {
                return (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ scale: 0.4, opacity: 0, y: 50 }}
                    exit={{
                      scale: 0,
                      opacity: 0,
                      transition: { duration: 0.2 },
                    }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    style={{ padding: "0.8rem" }}
                  >
                    <Item key={notification.id} variants={variants.item}>
                      <IconWrapper>
                        {notification.icon ||
                          Icons.info({
                            theme: notification.theme || "light",
                            type: toast.TYPE.INFO,
                          })}
                      </IconWrapper>
                      <NotificationContent>
                        <span>{notification.content}</span>
                        <TimeTracker createdAt={notification.createdAt} />
                      </NotificationContent>
                      <ItemActions
                        notification={notification}
                        markAsRead={markAsRead}
                        remove={remove}
                      />
                    </Item>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </Content>
        </AnimatePresence>
        <Footer>
          <FooterButtonSecondary onClick={clear}>Clear All</FooterButtonSecondary>
          <FooterButton onClick={markAllAsRead}>Mark All as read</FooterButton>
        </Footer>
      </Container>
    </OuterWrapper>
  );
};

export default NotificationCenter;
