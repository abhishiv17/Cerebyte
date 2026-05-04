from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Any, Optional
from datetime import datetime

class ERDiagramBase(BaseModel):
    title: str
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

class ERDiagramCreate(ERDiagramBase):
    pass

class ERDiagramUpdate(BaseModel):
    title: Optional[str] = None
    nodes: Optional[List[Dict[str, Any]]] = None
    edges: Optional[List[Dict[str, Any]]] = None

class ERDiagramResponse(ERDiagramBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
