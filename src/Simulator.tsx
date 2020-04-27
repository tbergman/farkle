import React from "react";
import {useMachine} from '@xstate/react';
import './game/bots/FarkleSim.ts'
import { createFarkleGame } from "./game/Farkle";


export const Simulator = () => {
  const [current, send] = useMachine(createFarkleGame(2));
  console.log(current, send)
  return (
    <div>Simulator</div>
  )
}