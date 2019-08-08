import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import {
  ShelfEntry,
  UserShelfEntry,
  FilterAutoMongoKeys,
} from '@caravan/buddy-reading-types';
import {
  makeStyles,
  Theme,
  createStyles,
  useTheme,
} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListElementBook from '../../../components/ListElementBook';
import { Radio, IconButton, Paper, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import PlusIcon from '@material-ui/icons/Add';
import AmazonBuyButton from '../../../components/AmazonBuyButton';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
    errorContainer: {
      //backgroundColor: theme.palette.error.light,
      boxShadow: `0px 2px 8px ${theme.palette.error.main}`,
    },
  })
);

interface BookListProps {
  id: string;
  data:
    | ShelfEntry
    | UserShelfEntry
    | FilterAutoMongoKeys<ShelfEntry>[]
    | FilterAutoMongoKeys<UserShelfEntry>[];
  primary?: 'radio';
  secondary?: 'delete' | 'add';
  tertiary?: 'buy';
  onClick?: any;
  onRadioPress?: (value: string) => void;
  radioValue?: string;
  onDelete?: (elementId: string, index: number, listId: string) => void;
  onAdd?: (book: ShelfEntry) => void;
  footerElement?: JSX.Element;
  droppable?: boolean;
  disableDrop?: boolean;
  draggingElementId?: string;
  error?: { valid: boolean; errMessage: string };
}

export default function BookList(props: BookListProps) {
  const theme = useTheme();
  const classes = useStyles();
  const {
    id,
    data,
    primary,
    secondary,
    tertiary,
    onClick,
    onRadioPress,
    radioValue,
    onDelete,
    onAdd,
    footerElement,
    droppable,
    disableDrop,
    draggingElementId,
    error,
  } = props;

  function radio(
    b: FilterAutoMongoKeys<ShelfEntry>,
    index: number
  ): JSX.Element {
    if (onRadioPress && radioValue) {
      return (
        <Radio
          checked={radioValue === b.sourceId}
          onChange={(e, checked) => onRadioPress(e.target.value)}
          value={b.sourceId}
          name={`radio-button-${b.title}`}
          color="primary"
        />
      );
    } else {
      throw new Error(
        'You need to pass an onRadioPress function, and radioValue prop to BookList to set primary = "radio"'
      );
    }
  }

  function deleteIcon(
    b: FilterAutoMongoKeys<ShelfEntry>,
    index: number
  ): JSX.Element {
    if (onDelete) {
      return (
        <IconButton
          className={classes.button}
          value={b.sourceId || index}
          onClick={() => onDelete(b.sourceId, index, id)}
        >
          <DeleteIcon />
        </IconButton>
      );
    } else {
      throw new Error(
        'You need to pass an onDelete function to set secondary = "delete"'
      );
    }
  }

  function addIcon(b: ShelfEntry, index: number): JSX.Element {
    if (onAdd) {
      return (
        <IconButton
          className={classes.button}
          value={b._id}
          onClick={() => onAdd(b)}
        >
          <PlusIcon />
        </IconButton>
      );
    } else {
      throw new Error(
        'You need to pass an onAdd function to set secondary = "add"'
      );
    }
  }

  function buyButton(link: string | undefined): JSX.Element {
    return <AmazonBuyButton link={link} />;
  }

  // If you're making changes to the render here you will need to replicate them in both the droppable and regular cases.
  // TODO: Make this cleaner.
  if (droppable) {
    return (
      <div>
        <Paper
          className={error && !error.valid ? classes.errorContainer : undefined}
        >
          <Droppable
            droppableId={id}
            isDropDisabled={disableDrop != null ? disableDrop : undefined}
          >
            {(provided, snapshot) => (
              <List
                dense={false}
                innerRef={provided.innerRef}
                {...provided.droppableProps}
              >
                {(data as UserShelfEntry[]).map((b, index) => {
                  let selected = false;
                  if (radioValue && radioValue === b._id) {
                    selected = true;
                  }
                  let primaryElement: JSX.Element | undefined;
                  switch (primary) {
                    case 'radio':
                      primaryElement = radio(b, index);
                      break;
                  }
                  let secondaryElement: JSX.Element | undefined;
                  switch (secondary) {
                    case 'delete':
                      secondaryElement = deleteIcon(b, index);
                      break;
                    case 'add':
                      secondaryElement = addIcon(b, index);
                      break;
                  }
                  let tertiaryElement: JSX.Element | undefined;
                  switch (tertiary) {
                    case 'buy':
                      tertiaryElement = buyButton(b.amazonLink);
                  }
                  //Generate unique ID for each book to handle duplicates
                  const bookId = b.isbn + index.toString() + id;
                  return (
                    <ListElementBook
                      id={bookId}
                      key={bookId}
                      index={index}
                      clubId={b.clubId}
                      club={b.club}
                      coverImage={b.coverImageURL}
                      primaryText={b.title}
                      secondaryText={b.author}
                      primary={primaryElement}
                      secondary={secondaryElement}
                      tertiary={tertiaryElement}
                      onClick={onClick}
                      selected={selected}
                      draggable={droppable}
                      isDragging={
                        draggingElementId
                          ? draggingElementId === bookId
                          : undefined
                      }
                    />
                  );
                })}
                {footerElement}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </Paper>
        {error && !error.valid && (
          <Typography
            color="error"
            variant="body2"
            style={{ marginTop: theme.spacing(1) }}
          >
            {error.errMessage}
          </Typography>
        )}
      </div>
    );
  } else {
    return (
      <Paper>
        <List dense={false}>
          {(data as UserShelfEntry[]).map((b, index) => {
            let selected = false;
            if (radioValue && radioValue === b._id) {
              selected = true;
            }
            let primaryElement: JSX.Element | undefined;
            switch (primary) {
              case 'radio':
                primaryElement = radio(b, index);
                break;
            }
            let secondaryElement: JSX.Element | undefined;
            switch (secondary) {
              case 'delete':
                secondaryElement = deleteIcon(b, index);
                break;
              case 'add':
                secondaryElement = addIcon(b, index);
                break;
            }
            let tertiaryElement: JSX.Element | undefined;
            switch (tertiary) {
              case 'buy':
                tertiaryElement = buyButton(b.amazonLink);
            }
            //Generate unique ID for each book to handle duplicates
            const bookId = b.isbn + index.toString() + id;
            return (
              <ListElementBook
                id={bookId}
                key={bookId}
                index={index}
                clubId={b.clubId}
                club={b.club}
                coverImage={b.coverImageURL}
                primaryText={b.title}
                secondaryText={b.author}
                primary={primaryElement}
                secondary={secondaryElement}
                tertiary={tertiaryElement}
                onClick={onClick}
                selected={selected}
              />
            );
          })}
          {footerElement}
        </List>
      </Paper>
    );
  }
}
