/* eslint-disable react/display-name */
import React from 'react'
import { Image, TouchableOpacity, Text } from 'react-native'
import { createAppContainer, createStackNavigator } from 'react-navigation'

import MainTabNavigator from './TabNavigator'

const stackNavigator = createStackNavigator(
  {
    Main: {
      screen: MainTabNavigator,
      navigationOptions: () => ({
        header: null
      }),
    },
  },
  {
    defaultNavigationOptions: () => ({
      titleStyle: {
        fontFamily: 'Arial',
      },
      headerStyle: {
        backgroundColor: '#2A3840',
        borderBottomWidth: 0,
      },
      headerBackground: (
        <Image
          style={{ flex: 1,  }}
          resizeMode='cover'
        />
      ),
      headerTitleStyle: {
        color: 'black',
        fontFamily: 'Arial',
      },
      headerTintColor: '#222222',
      headerLeft: props => (
        <TouchableOpacity
          onPress={props.onPress}
          style={{
            paddingLeft: 25,
          }}
        >
          {/* <Image
            source={require('../../../assets/images/icons/arrow-back.png')}
            resizeMode='contain'
            style={{
              height: 20,
            }}
          /> */}
          <Text>back</Text>
        </TouchableOpacity>
      ),
    }),
  },
);

export default createAppContainer(stackNavigator);
