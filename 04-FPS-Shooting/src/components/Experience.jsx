import { Environment, OrbitControls } from "@react-three/drei";
import { Map } from "./Map";
import { CharacterController } from "./CharacterSoldier";
import {
  Joystick,
  insertCoin,
  isHost,
  myPlayer,
  onPlayerJoin,
  useMultiplayerState,
} from "playroomkit";
import { useEffect } from "react";


export const Experience = () => {

  const start = async () => {
    // const { default: { start } } = await import("../game/start");
    // start();
    await insertCoin();
  }

  useEffect(() => {
    start();
    // create a jousttick controller for each player 
    onPlayerJoin((state) => {
      const joystick = new JoyStick({
        type: "angular",
        buttons: [{id: "fire", label: "Fire"}],
        color: "red",
      }); 
      const newPLayer = { state, joystick };
      state.setState("health", 100);
      state.setState("deaths", 0);
      state.setState("kills", 0);

      state.onQuit(() => {
        setPlayers((players) => players.filter((p) => p.state.id !== state.id));
      });
    });
  }, []);

  return (
    <>
      <directionalLight
        position={[25, 18, -25]}
        intensity={0.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={80}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0001} 
      />  
      <OrbitControls />
      <Map />
      {
        player.map(({state, joystick}, idx) => (
          <CharacterController
            key={state.id}
            state={state}
            joystick={joystick}
            userPlayer={state.id === myPlayer().id}
            position={idx === 0 ? [0, 0, 0] : [0, 0, 0]}
            rotation={idx === 0 ? [0, 0, 0] : [0, Math.PI, 0]}
          />
        ))
      }
      <Environment preset="sunset" />
    </>
  );
};
