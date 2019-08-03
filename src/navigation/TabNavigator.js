/* eslint-disable react/display-name */

import React from 'react'
import { Image, View, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from 'react-navigation'

import Test from 'Components/Test'

import iconHome from 'Images/tabbar/home.png'
import iconCalendar from 'Images/tabbar/calendar.png'
import iconGrids from 'Images/tabbar/grids.png'
import iconPages from 'Images/tabbar/pages.png'
import iconComponents from 'Images/tabbar/components.png'

const styles = StyleSheet.create({
  tabBarItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0,
    borderBottomColor: '#252A34',
    paddingHorizontal: 10,
  },
  tabBarIcon: {
    width: 23,
    height: 23,
  },
  tabBarIconFocused: {
    tintColor: 'blue',
  },
  headerContainer: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
  },
  headerCaption: {
    fontFamily: 'Arial',
    color: 'black',
    fontSize: 18,
  },
})

export default createBottomTabNavigator(
  {
    Home: {
      screen: Test,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state
        let iconSource
        switch (routeName) {
          case 'Home':
            iconSource = iconHome
            break
          case 'Swap':
            iconSource = iconCalendar
            break
          case 'Rankings':
            iconSource = iconGrids
            break
          case 'Orders':
            iconSource = iconPages
            break
          case 'Settings':
            iconSource = iconComponents
            break
          default:
            iconSource = iconComponents
        }
        return (
          <View style={styles.tabBarItemContainer}>
            <Image
              resizeMode='contain'
              source={iconSource}
              style={[styles.tabBarIcon, focused && styles.tabBarIconFocused]}
            />
          </View>
        )
      },
    }),
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: true,
    headerMode: 'auto',
    tabBarOptions: {
      showLabel: false,
      style: {
        backgroundColor: 'white',
        borderTopWidth: 0.5,
        borderTopColor: 'transparent',
      },
      labelStyle: {
        color: 'grey',
      },
    },
  },
)
