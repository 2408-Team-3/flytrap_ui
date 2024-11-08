import { useEffect, useState } from "react";
import {
  Box,
  Select,
  VStack,
  Text,
  HStack,
  IconButton,
  Button,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import {
  getAllProjects,
  getUsersForProject,
  addUserToProject,
  removeUserFromProject,
} from "../../services/data";

const AssignUsers = ({ users }) => {
  const [projects, setProjects] = useState([]);
  const [currentUsers, setCurrentUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const toast = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await getAllProjects();
      setProjects(data.projects);
    };
    try {
      fetchProjects();
    } catch {
      alert("Could not fetch projects");
    }
  }, []);

  function handleProjectSelection(uuid) {
    // const selection = projects.find((project) => project.name === name);
    fetchUsersForProject(uuid);
  }

  function handleUserSelection(uuid) {
    setSelectedUser(uuid);
    // const selection = users.find((user) => user.name )
  }

  async function fetchUsersForProject(uuid) {
    try {
      console.log("project selection", uuid);
      const { data } = await getUsersForProject(uuid);
      console.log("users for project:", data);
      // const usersForProject = users.filter((user) => data.includes(user.id));
      setCurrentUsers(data);
      setSelectedProject(uuid);
    } catch {
      alert("Could not fetch users for selected project");
    }
  }

  async function deleteUserFromProject(project_id, user_id) {
    try {
      await removeUserFromProject(project_id, user_id);
      setCurrentUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== user_id)
      );

      console.log("projects", projects, project_id, user_id);
      console.log("cu", currentUsers);

      setCurrentUsers((prevUsers) =>
        prevUsers.filter((user) => user.uuid !== user_id)
      );

      toast({
        title: "User removed.",
        description: "User has been removed from the project.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch {
      alert("Could not remove user from project");
    }
  }

  const addNewUserToProject = async () => {
    try {
      const data = await addUserToProject(selectedProject, selectedUser);

      setCurrentUsers((prevUsers) => {
        const newUser = users.find((user) => user.uuid === selectedUser);
        return [...prevUsers, newUser];
      });

      setSelectedUser("");
      toast({
        title: "Users added.",
        description: "Users have been added to the project.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch {
      alert("Could not add users to project");
    }
  };

  const availableUsers = users.filter(
    (user) =>
      !currentUsers.some((currentUser) => currentUser.uuid === user.uuid)
  );

  return (
    <Box
      borderWidth={1}
      borderRadius="lg"
      padding={5}
      minHeight="600px"
      boxShadow="lg"
      maxW="800px"
      mx="auto"
    >
      <Heading as="h2" size="lg" mb={4} textAlign="center">
        Project Assignments
      </Heading>
      <HStack spacing={10} align="start">
        {/* Project Selection Column */}
        <VStack align="start" spacing={4}>
          <Text fontWeight="bold" fontSize="lg">
            Project
          </Text>
          <Select
            placeholder="Select a project"
            onChange={(e) => {
              handleProjectSelection(e.target.value);
            }}
          >
            {projects.map((project) => (
              <option key={project.uuid} value={project.uuid}>
                {project.name}
              </option>
            ))}
          </Select>
        </VStack>

        {/* Current Users Column */}
        <VStack align="start" flex={1} spacing={4}>
          <Text fontWeight="bold" fontSize="lg">
            Current Users
          </Text>
          <VStack spacing={2}>
            {currentUsers.map((user) => (
              <HStack key={user.uuid} justify="space-between" width="full">
                <Text>{`${user.first_name} ${user.last_name}`}</Text>
                <IconButton
                  icon={<FaTrash />}
                  aria-label="Remove User"
                  size="sm"
                  onClick={() =>
                    deleteUserFromProject(selectedProject, user.uuid)
                  }
                />
              </HStack>
            ))}
          </VStack>
        </VStack>

        {/* Add User Column */}
        <VStack align="start" flex={1} spacing={4}>
          <Text fontWeight="bold" fontSize="lg">
            Add User
          </Text>
          <Select
            placeholder="Select users to add"
            multiple
            size="lg"
            height="200px"
            onChange={(e) => {
              handleUserSelection(e.target.value);
            }}
          >
            {availableUsers.map((user) => (
              <option key={user.uuid} value={user.uuid}>
                {`${user.first_name} ${user.last_name}`}
              </option>
            ))}
          </Select>
          <Button mt={2} onClick={addNewUserToProject} colorScheme="teal">
            Add
          </Button>
        </VStack>
      </HStack>
    </Box>
  );
};

export default AssignUsers;
