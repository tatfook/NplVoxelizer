--[[
Title: 
Author(s):  
Date: 
Desc: 
use the lib:
------------------------------------------------------------
NPL.load("(gl)Mod/NplVoxelizer/main.lua");
local NplVoxelizer = commonlib.gettable("Mod.NplVoxelizer");
------------------------------------------------------------
]]
local NplVoxelizer = commonlib.inherit(commonlib.gettable("Mod.ModBase"),commonlib.gettable("Mod.NplVoxelizer"));

function NplVoxelizer:ctor()
end

-- virtual function get mod name

function NplVoxelizer:GetName()
	return "NplVoxelizer"
end

-- virtual function get mod description 

function NplVoxelizer:GetDesc()
	return "NplVoxelizer is a plugin in paracraft"
end

function NplVoxelizer:init()
	LOG.std(nil, "info", "NplVoxelizer", "plugin initialized");
	NPL.load("npl_packages/NplCadLibrary/");
	NPL.load("npl_packages/ModelVoxelizer/");

end

function NplVoxelizer:OnLogin()
end
-- called when a new world is loaded. 

function NplVoxelizer:OnWorldLoad()
end
-- called when a world is unloaded. 

function NplVoxelizer:OnLeaveWorld()
end

function NplVoxelizer:OnDestroy()
end
