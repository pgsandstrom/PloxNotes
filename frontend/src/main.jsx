import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  addNote,
  removeNote,
  switchChecked,
  setFocus,
  editNote,
  load,
  save } from './actions';
import { CheckBox } from './widgets';

import './main.scss';

class Main extends React.Component {
  componentWillMount() {
    this.props.load(this.props.params.noteid);
  }

  render() {
    return (
      <div className="react-root">
        <div className="main">
          <div className="title">{this.props.params.noteid}</div>
          <div className="notes">
            {this.props.notes.map((note, index) =>
              <Note
                key={index}
                text={note.text}
                checked={note.checked}
                index={index}
                lastNote={index === this.props.notes.length - 1}
                focusIndex={this.props.focusIndex}
                switchChecked={() => this.props.switchChecked(index)}
                setFocus={this.props.setFocus}
                addNote={() => this.props.addNote(index + 1)}
                delete={() => this.props.removeNote(index)}
                editNote={text => this.props.editNote(index, text)}
              />)}
          </div>
          <div className="bottom">
            <button className="normalize-button standard-button button-add" onClick={() => this.props.addNote(this.props.notes.length)}>Add</button>
            <button className="normalize-button standard-button button-save" onClick={() => this.props.save(this.props.params.noteid, this.props.notes)}>Save</button>
          </div>
        </div>
      </div>
    );
  }
}
Main.propTypes = {
  params: PropTypes.object,
  notes: PropTypes.array,
  focusIndex: PropTypes.number,
  removeNote: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  addNote: PropTypes.func,
  switchChecked: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  setFocus: PropTypes.func.isRequired,
  editNote: PropTypes.func,
  load: PropTypes.func,
  save: PropTypes.func,
};


class Note extends React.Component {
  constructor(props) {
    super(props);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    if (this.props.focusIndex === this.props.index) {
      this.textInput.focus();
      this.props.setFocus(-1);
    }
    if (this.props.lastNote && this.props.focusIndex === -1) {
      this.textInput.focus();
    }
  }

  componentDidUpdate() {
    if (this.props.focusIndex === this.props.index) {
      this.textInput.focus();
      this.props.setFocus(-1);
    }
  }

  onKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.props.addNote();
    }
  }

  onKeyDown(e) {
    if (e.keyCode === 8 && this.props.text === '') { // backspace
      e.preventDefault();
      this.props.delete();
      this.props.setFocus(this.props.index - 1);
    }
  }

  render() {
    return (
      <div className="note">
        <CheckBox checked={this.props.checked} checkCb={this.props.switchChecked} />
        <input
          className="standard-input"
          value={this.props.text}
          onChange={e => this.props.editNote(e.target.value)}
          onKeyPress={e => this.onKeyPress(e)}
          onKeyDown={e => this.onKeyDown(e)}
          ref={(input) => { this.textInput = input; }}
        />
        <button className="normalize-button standard-button delete-button" onClick={this.props.delete}>delete</button>
      </div>
    );
  }
}
Note.propTypes = {
  text: PropTypes.string,
  checked: PropTypes.bool,
  index: PropTypes.number,
  lastNote: PropTypes.bool,
  focusIndex: PropTypes.number,
  addNote: PropTypes.func,
  delete: PropTypes.func,
  switchChecked: PropTypes.func,
  setFocus: PropTypes.func,
  editNote: PropTypes.func,
};

export default connect(state => ({
  notes: state.noteReducer.notes,
  focusIndex: state.noteReducer.focusIndex,
}),
  {
    addNote,
    removeNote,
    switchChecked,
    setFocus,
    editNote,
    load,
    save,
  })(Main);
