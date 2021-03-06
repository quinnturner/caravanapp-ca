import React from 'react';

import { PostUserInfo } from '@caravanapp/types';
import {
  Avatar,
  Fab,
  IconButton,
  makeStyles,
  MuiThemeProvider,
  Typography,
} from '@material-ui/core';

import AdapterLink from '../../components/AdapterLink';
import DiscordLoginModal from '../../components/DiscordLoginModal';
import GenericGroupMemberIcon from '../../components/misc-avatars-icons-labels/icons/GenericGroupMemberIcon';
import shelfIcon from '../../resources/post-icons/shelf_icon.svg';
import { shelfPostTheme, washedTheme } from '../../theme';

const useStyles = makeStyles(theme => ({
  postTypes: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
  },
  loggedOutAvatar: {
    backgroundColor: washedTheme.palette.primary.main,
  },
  fab: {
    margin: theme.spacing(1),
    height: 40,
  },
  postIconAvatar: {
    width: 40,
    height: 40,
    padding: theme.spacing(1),
  },
}));

interface ComposerProps {
  currUserInfo: PostUserInfo | null;
}

export default function Composer(props: ComposerProps) {
  const classes = useStyles();

  const { currUserInfo } = props;

  const [loginModalShown, setLoginModalShown] = React.useState(false);

  function onCloseLoginModal() {
    setLoginModalShown(false);
  }

  return (
    <div className={classes.postTypes}>
      {currUserInfo && (
        <Avatar
          alt={currUserInfo.name}
          src={currUserInfo.photoUrl}
          className={classes.headerAvatar}
        />
      )}
      {!currUserInfo && (
        <IconButton className={classes.loggedOutAvatar}>
          <GenericGroupMemberIcon color="primary" />
        </IconButton>
      )}
      <MuiThemeProvider theme={shelfPostTheme}>
        {currUserInfo && (
          <Fab
            variant="extended"
            aria-label="upload-shelf"
            className={classes.fab}
            color="primary"
            component={AdapterLink}
            to="/post/create"
          >
            <Typography
              variant="subtitle2"
              style={{ fontWeight: 600, color: 'white' }}
            >
              Create Shelf
            </Typography>
            <img
              src={shelfIcon}
              alt="Upload shelf"
              className={classes.postIconAvatar}
            />
          </Fab>
        )}
        {!currUserInfo && (
          <Fab
            variant="extended"
            aria-label="upload-shelf"
            className={classes.fab}
            color="primary"
            onClick={() => setLoginModalShown(true)}
          >
            <Typography
              variant="subtitle2"
              style={{ fontWeight: 600, color: 'white' }}
            >
              Create Shelf
            </Typography>
            <img
              src={shelfIcon}
              alt="Upload shelf"
              className={classes.postIconAvatar}
            />
          </Fab>
        )}
      </MuiThemeProvider>
      <DiscordLoginModal
        onCloseLoginDialog={onCloseLoginModal}
        open={loginModalShown}
      />
    </div>
  );
}
