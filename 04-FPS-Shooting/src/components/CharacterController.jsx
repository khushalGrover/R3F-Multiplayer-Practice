import { useRef, useState } from 'react';
import {  CharacterSoldier } from './CharacterController';

export const CharacterSoldier = ({
    state,
    joystick,
    userPlayer,
    ...props
}) => {
    const group = useRef();
    const chracter = useRef();
    const [animations, setAnimation] = useState('idle');
    
    return (
        <group {...props} ref={group}>
          {userPlayer && <CameraControls ref={controls} />}
            <RigidBody
              ref={rigidbody}
              colliders={false}
              linearDamping={12}
              lockRotations
              type={isHost() ? "dynamic" : "kinematicPosition"}
              onIntersectionEnter={({ other }) => {
                if (
                  isHost() &&
                  other.rigidBody.userData.type === "bullet" &&
                  state.state.health > 0
                ) {
                  const newHealth =
                    state.state.health - other.rigidBody.userData.damage;
                  if (newHealth <= 0) {
                    state.setState("deaths", state.state.deaths + 1);
                    state.setState("dead", true);
                    state.setState("health", 0);
                    rigidbody.current.setEnabled(false);
                    setTimeout(() => {
                      spawnRandomly();
                      rigidbody.current.setEnabled(true);
                      state.setState("health", 100);
                      state.setState("dead", false);
                    }, 2000);
                    onKilled(state.id, other.rigidBody.userData.player);
                  } else {
                    state.setState("health", newHealth);
                  }
                }
              }}
            >
                <PlayerInfo state={state.state} />
                <group ref={character}>
                  <CharacterSoldier
                    color={state.state.profile?.color}
                    animation={animation}
                    weapon={weapon}
                  />
                  {userPlayer && (
                    <Crosshair
                      position={[WEAPON_OFFSET.x, WEAPON_OFFSET.y, WEAPON_OFFSET.z]}
                    />
                  )}
                </group>
                {userPlayer && (
                  // Finally I moved the light to follow the player
                  // This way we won't need to calculate ALL the shadows but only the ones
                  // that are in the camera view
                  <directionalLight
                    ref={directionalLight}
                    position={[25, 18, -25]}
                    intensity={0.3}
                    castShadow={!downgradedPerformance} // Disable shadows on low-end devices
                    shadow-camera-near={0}
                    shadow-camera-far={100}
                    shadow-camera-left={-20}
                    shadow-camera-right={20}
                    shadow-camera-top={20}
                    shadow-camera-bottom={-20}
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-bias={-0.0001}
                  />
                )}
                <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.28, 0]} />
            </RigidBody>
        </group>
    );
};