

import React, { Component } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import _ from 'lodash';


export default class App extends Component {
  state = {
    currentDownload: null,
    numberOfDownloads: 0,
    progress: new Animated.Value(0)
  }
  
  startAnimation = () => {
    const width = Dimensions.get('window').width;
    Animated.timing(this.state.progress, {
      toValue: width,
      duration: 2000
    }).start(() => {
      if (this.state.currentDownload < this.state.numberOfDownloads) {
        this.setState({ 
          currentDownload: this.state.currentDownload + 1,
          progress: new Animated.Value(0)
        }, () => {
          this.startAnimation();
        });
      } else {
        // We're done with downloads
        this.setState({ currentDownload: null });
      }
    });
  }

  onAnimatePress = () => {
    this.startAnimation();
  }

  onAddProgressPress = () => {
    const { currentDownload, numberOfDownloads } = this.state;

    if (currentDownload !== null) {
      this.setState({ numberOfDownloads: numberOfDownloads + 1 });
    } else {
      this.setState({
        currentDownload: numberOfDownloads,
        numberOfDownloads: numberOfDownloads + 1
      }, () => this.startAnimation());
    }
  }

  renderDownload = index => {
    const { currentDownload, progress } = this.state;

    let progressStyle;
    if (index === currentDownload) {
      progressStyle = {
        backgroundColor: 'blue',
        height: 50,
        width: progress
      };
    } else if (currentDownload === null) {
      progressStyle = {
        backgroundColor: 'blue',
        height: 50,
        width: Dimensions.get('window').width
      }
    } else if (index < currentDownload) {
      progressStyle = {
        backgroundColor: 'blue',
        height: 50,
        width: Dimensions.get('window').width
      }
    }

    return (
      <View key={index}
        style={styles.downloadContainer}>
        <Animated.View style={progressStyle} />
      </View>
    )
  }

  renderList = () => {
    const { numberOfDownloads } = this.state;
    const range = _.range(numberOfDownloads);

    return (
      <View style={styles.list}>
        {_.map(range, index => {
          return this.renderDownload(index);
        })}
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderList()}
        <TouchableOpacity style={styles.button}
          onPress={this.onAddProgressPress}>
          <Text style={styles.buttonText}>
            Download
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  downloadContainer: {
    backgroundColor: '#ccc',
    height: 50,
    borderWidth: 1,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: 5,
    marginTop: 12,
    width: 120,
    marginRight: 20
  },
  buttonText: {
    color: 'white',
    padding: 8
  }
});
